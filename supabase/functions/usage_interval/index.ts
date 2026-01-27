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
  const fnIdx = parts.indexOf("usage_interval");
  const rest = fnIdx >= 0 ? parts.slice(fnIdx + 1) : [];
  return { rest };
}

async function requireUserId(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

async function ensureReportOwned(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  reportId: number,
) {
  const { data, error } = await supabase
    .from("usage_report")
    .select("report_id, meter_id, meter!inner(meter_id, properties!inner(user_id))")
    .eq("report_id", reportId)
    .eq("meter.properties.user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

type IntervalInput = { start_ts: string; kwh: number };

type BulkInsertBody = {
  report_id: number;
  intervals: IntervalInput[];
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

    // POST /bulk  body: { report_id, intervals: [{start_ts, kwh}, ...] }
    if (req.method === "POST" && rest[0] === "bulk") {
      const body = (await req.json().catch(() => ({}))) as BulkInsertBody;
      const reportId = parseId(String(body.report_id ?? ""));
      if (!reportId) return json({ error: "Missing or invalid report_id" }, 400);
      if (!Array.isArray(body.intervals) || body.intervals.length === 0) {
        return json({ error: "Missing intervals" }, 400);
      }

      const report = await ensureReportOwned(supabase, userId, reportId);
      if (!report) return json({ error: "Forbidden" }, 403);

      const rows = body.intervals.map((r) => ({
        report_id: reportId,
        start_ts: r.start_ts,
        kwh: r.kwh,
      }));

      const { error } = await supabase.from("usage_interval").insert(rows);
      if (error) throw error;

      return json({ message: "Intervals inserted", count: rows.length }, 201);
    }

    // GET /report/:report_id
    if (req.method === "GET" && rest[0] === "report") {
      const reportId = parseId(rest[1]);
      if (!reportId) return json({ error: "Invalid report_id" }, 400);

      const report = await ensureReportOwned(supabase, userId, reportId);
      if (!report) return json({ error: "Forbidden" }, 403);

      const { data, error } = await supabase
        .from("usage_interval")
        .select("report_id, start_ts, kwh")
        .eq("report_id", reportId)
        .order("start_ts", { ascending: true });

      if (error) throw error;
      return json(data ?? [], 200);
    }

    // DELETE /report/:report_id (delete all intervals for report)
    if (req.method === "DELETE" && rest[0] === "report") {
      const reportId = parseId(rest[1]);
      if (!reportId) return json({ error: "Invalid report_id" }, 400);

      const report = await ensureReportOwned(supabase, userId, reportId);
      if (!report) return json({ error: "Forbidden" }, 403);

      const { error } = await supabase.from("usage_interval").delete().eq("report_id", reportId);
      if (error) throw error;

      return json({ message: "Intervals deleted" }, 200);
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    return json({ message: err instanceof Error ? err.message : String(err) }, 500);
  }
});