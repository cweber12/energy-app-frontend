import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" },
  });
}

function options() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function parseId(s: string | undefined): number | null {
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function getSegments(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const fnIdx = parts.indexOf("meter");
  const rest = fnIdx >= 0 ? parts.slice(fnIdx + 1) : [];
  return { rest };
}

async function requireUserId(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

async function ensurePropertyOwned(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  propertyId: number,
) {
  const { data, error } = await supabase
    .from("properties")
    .select("property_id, user_id")
    .eq("property_id", propertyId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return false;
  return true;
}

async function ensureMeterOwned(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  meterId: number,
) {
  const { data, error } = await supabase
    .from("meter")
    .select("meter_id, property_id, utility, meter_name, properties!inner(user_id)")
    .eq("meter_id", meterId)
    .eq("properties.user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

type CreateMeterBody = {
  property_id: number;
  utility?: string;
  meter_name?: string | null;
};

type UpdateMeterBody = Partial<{
  utility: string;
  meter_name: string | null;
}>;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return options();

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );

    const userId = await requireUserId(supabase);
    if (!userId) return json({ error: "Unauthorized" }, 401);

    const { rest } = getSegments(req);

    // POST / (create meter)
    if (req.method === "POST" && rest.length === 0) {
      const body = (await req.json().catch(() => ({}))) as CreateMeterBody;

      const propertyId = parseId(String(body.property_id ?? ""));
      if (!propertyId) return json({ error: "Missing or invalid property_id" }, 400);

      const ok = await ensurePropertyOwned(supabase, userId, propertyId);
      if (!ok) return json({ error: "Forbidden" }, 403);

      const { data, error } = await supabase
        .from("meter")
        .insert({
          property_id: propertyId,
          utility: body.utility ?? "SDGE",
          meter_name: body.meter_name ?? null,
        })
        .select("meter_id")
        .single();

      if (error) throw error;
      return json({ meter_id: (data as any).meter_id }, 201);
    }

    // GET /property/:property_id (list meters for property)
    if (req.method === "GET" && rest[0] === "property") {
      const propertyId = parseId(rest[1]);
      if (!propertyId) return json({ error: "Invalid property_id" }, 400);

      const ok = await ensurePropertyOwned(supabase, userId, propertyId);
      if (!ok) return json({ error: "Forbidden" }, 403);

      const { data, error } = await supabase
        .from("meter")
        .select("meter_id, property_id, utility, meter_name, created_at")
        .eq("property_id", propertyId)
        .order("meter_id", { ascending: true });

      if (error) throw error;
      return json(data ?? [], 200);
    }

    // GET /:meter_id (get one)
    if (req.method === "GET" && rest.length === 1) {
      const meterId = parseId(rest[0]);
      if (!meterId) return json({ error: "Invalid meter_id" }, 400);

      const meter = await ensureMeterOwned(supabase, userId, meterId);
      if (!meter) return json({ error: "Meter not found" }, 404);

      return json(meter, 200);
    }

    // PUT /:meter_id (update)
    if (req.method === "PUT" && rest.length === 1) {
      const meterId = parseId(rest[0]);
      if (!meterId) return json({ error: "Invalid meter_id" }, 400);

      const meter = await ensureMeterOwned(supabase, userId, meterId);
      if (!meter) return json({ error: "Meter not found" }, 404);

      const body = (await req.json().catch(() => ({}))) as UpdateMeterBody;

      const update: Record<string, unknown> = {};
      if (body.utility !== undefined) update.utility = body.utility;
      if (body.meter_name !== undefined) update.meter_name = body.meter_name;

      if (Object.keys(update).length === 0) return json({ error: "No fields to update" }, 400);

      const { error } = await supabase.from("meter").update(update).eq("meter_id", meterId);
      if (error) throw error;

      return json({ message: "Meter updated" }, 200);
    }

    // DELETE /:meter_id
    if (req.method === "DELETE" && rest.length === 1) {
      const meterId = parseId(rest[0]);
      if (!meterId) return json({ error: "Invalid meter_id" }, 400);

      const meter = await ensureMeterOwned(supabase, userId, meterId);
      if (!meter) return json({ error: "Meter not found" }, 404);

      const { error } = await supabase.from("meter").delete().eq("meter_id", meterId);
      if (error) throw error;

      return json({ message: "Meter deleted" }, 200);
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    return json({ message: err instanceof Error ? err.message : String(err) }, 500);
  }
});