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
  const fnIdx = parts.indexOf("usage_report");
  const rest = fnIdx >= 0 ? parts.slice(fnIdx + 1) : [];
  return { rest };
}

async function requireUserId(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

async function ensureMeterOwned(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  meterId: number,
) {
  const { data, error } = await supabase
    .from("meter")
    .select("meter_id, property_id, properties!inner(user_id)")
    .eq("meter_id", meterId)
    .eq("properties.user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

async function ensureReportOwned(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  reportId: number,
) {
  const { data, error } = await supabase
    .from("usage_report")
    .select("report_id, meter_id, report_date, interval_minutes, meter!inner(meter_id, properties!inner(user_id))")
    .eq("report_id", reportId)
    .eq("meter.properties.user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

type CreateUsageReportBody = {
  meter_id: number;
  report_date: string; // YYYY-MM-DD
  interval_minutes?: number;
  source_filename?: string | null;
};

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

    // POST / (create report metadata)
    if (req.method === "POST" && rest.length === 0) {
      const body = (await req.json().catch(() => ({}))) as CreateUsageReportBody;

      const meterId = parseId(String(body.meter_id ?? ""));
      if (!meterId) return json({ error: "Missing or invalid meter_id" }, 400);
      if (!body.report_date) return json({ error: "Missing report_date" }, 400);

      const meter = await ensureMeterOwned(supabase, userId, meterId);
      if (!meter) return json({ error: "Forbidden" }, 403);

      const { data, error } = await supabase
        .from("usage_report")
        .insert({
          meter_id: meterId,
          report_date: body.report_date,
          interval_minutes: body.interval_minutes ?? 60,
          source_filename: body.source_filename ?? null,
        })
        .select("report_id")
        .single();

      if (error) throw error;
      return json({ report_id: (data as any).report_id }, 201);
    }

    // GET /meter/:meter_id (list reports for meter)
    if (req.method === "GET" && rest[0] === "meter") {
      const meterId = parseId(rest[1]);
      if (!meterId) return json({ error: "Invalid meter_id" }, 400);

      const meter = await ensureMeterOwned(supabase, userId, meterId);
      if (!meter) return json({ error: "Forbidden" }, 403);

      const { data, error } = await supabase
        .from("usage_report")
        .select("report_id, meter_id, report_date, interval_minutes, source_filename, created_at")
        .eq("meter_id", meterId)
        .order("report_date", { ascending: false });

      if (error) throw error;
      return json(data ?? [], 200);
    }

    // GET /:report_id (get one)
    if (req.method === "GET" && rest.length === 1) {
      const reportId = parseId(rest[0]);
      if (!reportId) return json({ error: "Invalid report_id" }, 400);

      const report = await ensureReportOwned(supabase, userId, reportId);
      if (!report) return json({ error: "Report not found" }, 404);

      return json(report, 200);
    }

    // DELETE /:report_id
    if (req.method === "DELETE" && rest.length === 1) {
      const reportId = parseId(rest[0]);
      if (!reportId) return json({ error: "Invalid report_id" }, 400);

      const report = await ensureReportOwned(supabase, userId, reportId);
      if (!report) return json({ error: "Report not found" }, 404);

      const { error } = await supabase.from("usage_report").delete().eq("report_id", reportId);
      if (error) throw error;

      return json({ message: "Report deleted" }, 200);
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    return json({ message: err instanceof Error ? err.message : String(err) }, 500);
  }
});