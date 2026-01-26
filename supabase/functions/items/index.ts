import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

type ItemRow = {
  id: number;
  property_id: number;
  category_id: number;
  usage_type_id: number;
  nickname: string;
  rated_watts: number | null;
};

type CreateItemBody = {
  property_id: number;
  category_id: number;
  usage_type_id: number;
  nickname: string;
  rated_watts?: number | null;
};

type UpdateItemBody = Partial<{
  nickname: string;
  rated_watts: number | null;
  category_id: number;
  usage_type_id: number;
}>;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

function optionsResponse() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function getRestPath(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const fnIdx = parts.indexOf("items");
  const rest = fnIdx >= 0 ? parts.slice(fnIdx + 1) : [];
  return { rest };
}

function parseId(s: string | undefined): number | null {
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function requireUser(
  supabase: ReturnType<typeof createClient>,
) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { ok: false as const };
  return { ok: true as const, userId: data.user.id };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );

    const auth = await requireUser(supabase);
    if (!auth.ok) return jsonResponse({ error: "Unauthorized" }, 401);

    const { rest } = getRestPath(req);

    if (req.method === "POST" && (rest.length === 0 || rest[0] === "items")) {
      const body = (await req.json()) as CreateItemBody;

      if (
        body.property_id === undefined ||
        body.category_id === undefined ||
        body.usage_type_id === undefined ||
        !body.nickname
      ) {
        return jsonResponse({ error: "Missing required fields" }, 400);
      }

      const { data, error } = await supabase
        .from("items")
        .insert({
          property_id: body.property_id,
          category_id: body.category_id,
          usage_type_id: body.usage_type_id,
          nickname: body.nickname,
          rated_watts: body.rated_watts ?? null,
        })
        .select("id")
        .single();

      if (error) throw error;
      return jsonResponse({ item_id: data.id }, 201);
    }

    if (req.method === "GET") {
      if (rest.length === 0 || rest[0] === "items") {
        return jsonResponse({ error: "Not found" }, 404);
      }

      if (rest[0] === "property") {
        const propertyId = parseId(rest[1]);
        if (!propertyId) return jsonResponse({ error: "Invalid property_id" }, 400);

        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("property_id", propertyId)
          .order("id", { ascending: true });

        if (error) throw error;
        return jsonResponse(data, 200);
      }

      const itemId = parseId(rest[0]);
      if (!itemId) return jsonResponse({ error: "Invalid item_id" }, 400);

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", itemId)
        .single<ItemRow>();

      if (error) return jsonResponse({ error: "Electrical item not found" }, 404);
      return jsonResponse(data, 200);
    }

    if (req.method === "PUT") {
      const itemId = rest[0] === "items" ? parseId(rest[1]) : parseId(rest[0]);
      if (!itemId) return jsonResponse({ error: "Invalid item_id" }, 400);

      const body = (await req.json()) as UpdateItemBody;

      const update: Record<string, unknown> = {};
      if (body.nickname !== undefined) update.nickname = body.nickname;
      if (body.rated_watts !== undefined) update.rated_watts = body.rated_watts;
      if (body.category_id !== undefined) update.category_id = body.category_id;
      if (body.usage_type_id !== undefined) update.usage_type_id = body.usage_type_id;

      if (Object.keys(update).length === 0) {
        return jsonResponse({ message: "No fields to update" }, 400);
      }

      const { error } = await supabase
        .from("items")
        .update(update)
        .eq("id", itemId);

      if (error) throw error;
      return jsonResponse({ message: "Electrical item updated" }, 200);
    }

    if (req.method === "DELETE") {
      const itemId = rest[0] === "items" ? parseId(rest[1]) : parseId(rest[0]);
      if (!itemId) return jsonResponse({ error: "Invalid item_id" }, 400);

      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      return jsonResponse({ message: "Electrical item deleted" }, 200);
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (err) {
    return jsonResponse({ message: err instanceof Error ? err.message : String(err) }, 500);
  }
});