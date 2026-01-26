import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

type PropertyRow = {
  property_id: number;
  user_id: string;
  street_address: string;
  city: string;
  state_abbreviation: string;
  zip: string | null;
  created_at: string;
};

type CreatePropertyBody = {
  street_address: string;
  city: string;
  state_abbreviation: string;
  zip?: string | null;
};

type UpdatePropertyBody = Partial<{
  street_address: string;
  city: string;
  state_abbreviation: string;
  zip: string | null;
  zip_code: string | null;
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
  const fnIdx = parts.indexOf("properties");
  const rest = fnIdx >= 0 ? parts.slice(fnIdx + 1) : [];
  return { rest };
}

function parseId(s: string | undefined): number | null {
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) return jsonResponse({ error: "Unauthorized" }, 401);
    const userId = userData.user.id;

    const { rest } = getRestPath(req);

    let idPart: string | undefined;
    if (rest.length === 0) idPart = undefined;
    else if (rest[0] === "properties") idPart = rest[1];
    else idPart = rest[0];

    const propertyId = parseId(idPart);

    if (req.method === "POST" && !propertyId) {
      const body = (await req.json()) as CreatePropertyBody;

      if (!body.street_address || !body.city || !body.state_abbreviation) {
        return jsonResponse({ error: "Missing required fields" }, 400);
      }

      const { data, error } = await supabase
        .from("properties")
        .insert({
          user_id: userId,
          street_address: body.street_address,
          city: body.city,
          state_abbreviation: body.state_abbreviation,
          zip: body.zip ?? null,
        })
        .select("property_id")
        .single();

      if (error) throw error;
      return jsonResponse({ property_id: data.property_id }, 201);
    }

    if (req.method === "GET" && !propertyId) {
      const { data, error } = await supabase
        .from("properties")
        .select("property_id, street_address, city, state_abbreviation, zip")
        .eq("user_id", userId)
        .order("property_id", { ascending: true });

      if (error) throw error;
      return jsonResponse(data, 200);
    }

    if (req.method === "GET" && propertyId) {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("property_id", propertyId)
        .eq("user_id", userId)
        .single<PropertyRow>();

      if (error) return jsonResponse({ error: "Property not found" }, 404);
      return jsonResponse(data, 200);
    }

    if (req.method === "PUT" && propertyId) {
      const body = (await req.json()) as UpdatePropertyBody;

      const nextZip =
        body.zip !== undefined ? body.zip : (body.zip_code !== undefined ? body.zip_code : undefined);

      const update: Record<string, unknown> = {};
      if (body.street_address !== undefined) update.street_address = body.street_address;
      if (body.city !== undefined) update.city = body.city;
      if (body.state_abbreviation !== undefined) update.state_abbreviation = body.state_abbreviation;
      if (nextZip !== undefined) update.zip = nextZip;

      if (Object.keys(update).length === 0) return jsonResponse({ error: "No fields to update" }, 400);

      const { error } = await supabase
        .from("properties")
        .update(update)
        .eq("property_id", propertyId)
        .eq("user_id", userId);

      if (error) throw error;
      return jsonResponse({ message: "Property updated" }, 200);
    }

    if (req.method === "DELETE" && propertyId) {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("property_id", propertyId)
        .eq("user_id", userId);

      if (error) throw error;
      return jsonResponse({ message: "Property deleted" }, 200);
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (err) {
    return jsonResponse({ message: err instanceof Error ? err.message : String(err) }, 500);
  }
});