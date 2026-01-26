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
  const fnIdx = parts.indexOf("events");
  const rest = fnIdx >= 0 ? parts.slice(fnIdx + 1) : [];
  return { rest, url };
}

async function requireUserId(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

async function ensureItemOwned(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  itemId: number,
) {
  const { data, error } = await supabase
    .from("items")
    .select("id, property_id, nickname, properties!inner(user_id)")
    .eq("id", itemId)
    .eq("properties.user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return { id: data.id as number, nickname: (data as any).nickname as string };
}

function dayRangeUtc(dateStr: string) {
  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(`${dateStr}T00:00:00.000Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  return { startIso: start.toISOString(), endIso: end.toISOString() };
}

function minutesBetween(startIso: string, endIso: string) {
  const a = new Date(startIso).getTime();
  const b = new Date(endIso).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return (b - a) / 60000;
}

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

    // POST /start
    if (req.method === "POST" && rest[0] === "start") {
      const body = (await req.json().catch(() => ({}))) as { item_id?: number; start_ts?: string };
      const itemId = parseId(String(body.item_id ?? ""));
      const startTs = body.start_ts;

      if (!itemId || !startTs) return json({ error: "Missing item_id or start_ts" }, 400);

      const owned = await ensureItemOwned(supabase, userId, itemId);
      if (!owned) return json({ error: "Forbidden" }, 403);

      const { data, error } = await supabase
        .from("event_start")
        .insert({ item_id: itemId, start_ts: startTs })
        .select("event_id")
        .single();

      if (error) throw error;

      return json({ event_id: (data as any).event_id, start_ts: startTs }, 201);
    }

    // POST /end
    if (req.method === "POST" && rest[0] === "end") {
      const body = (await req.json().catch(() => ({}))) as { event_id?: number; end_ts?: string };
      const eventId = parseId(String(body.event_id ?? ""));
      const endTs = body.end_ts;

      if (!eventId || !endTs) return json({ error: "Missing event_id or end_ts" }, 400);

      const { data: startRow, error: startErr } = await supabase
        .from("event_start")
        .select("event_id, item_id")
        .eq("event_id", eventId)
        .single();

      if (startErr || !startRow) return json({ error: "Start event not found" }, 404);

      const owned = await ensureItemOwned(supabase, userId, (startRow as any).item_id);
      if (!owned) return json({ error: "Forbidden" }, 403);

      const { error } = await supabase
        .from("event_end")
        .insert({ event_id: eventId, end_ts: endTs });

      if (error) throw error;

      return json({ event_id: eventId, end_ts: endTs }, 201);
    }

    // GET /start/item/:item_id/latest_start
    if (req.method === "GET" && rest[0] === "start" && rest[1] === "item") {
      const itemId = rest[2];
      const mode = rest[3];
      if (!itemId || mode !== "latest_start") return json({ error: "Not found" }, 404);

      const owned = await ensureItemOwned(supabase, userId, itemId);
      if (!owned) return json({ error: "Forbidden" }, 403);

      const { data, error } = await supabase
        .from("event_start")
        .select("event_id, start_ts")
        .eq("item_id", itemId)
        .order("start_ts", { ascending: false })
        .limit(1);

      if (error) throw error;
      const row = (data ?? [])[0];
      if (!row) return json({ error: "No start events found for this item" }, 404);

      return json({ event_id: (row as any).event_id, start_ts: (row as any).start_ts }, 200);
    }

    // GET /end/item/:item_id/latest_end  OR /end/item/:item_id/daily_usage
    if (req.method === "GET" && rest[0] === "end" && rest[1] === "item") {
      const itemId = rest[2];
      const mode = rest[3];
      if (!itemId || !mode) return json({ error: "Not found" }, 404);

      const owned = await ensureItemOwned(supabase, userId, itemId);
      if (!owned) return json({ error: "Forbidden" }, 403);

      if (mode === "latest_end") {
        const { data: starts, error: sErr } = await supabase
          .from("event_start")
          .select("event_id, start_ts")
          .eq("item_id", itemId)
          .order("start_ts", { ascending: false })
          .limit(1);

        if (sErr) throw sErr;
        const latestStart = (starts ?? [])[0];
        if (!latestStart) return json({ error: "No end events found for this item" }, 404);

        const eventId = (latestStart as any).event_id as number;

        const { data: endRow, error: eErr } = await supabase
          .from("event_end")
          .select("event_id, end_ts")
          .eq("event_id", eventId)
          .maybeSingle();

        if (eErr || !endRow) return json({ error: "No end events found for this item" }, 404);

        return json({ event_id: (endRow as any).event_id, end_ts: (endRow as any).end_ts }, 200);
      }

      if (mode === "daily_usage") {
        const { data: starts, error: sErr } = await supabase
          .from("event_start")
          .select("event_id, start_ts")
          .eq("item_id", itemId)
          .order("start_ts", { ascending: false });

        if (sErr) throw sErr;

        const eventIds = (starts ?? []).map((r: any) => r.event_id);
        if (eventIds.length === 0) return json([], 200);

        const { data: ends, error: eErr } = await supabase
          .from("event_end")
          .select("event_id, end_ts")
          .in("event_id", eventIds);

        if (eErr) throw eErr;

        const endMap = new Map<number, string>();
        (ends ?? []).forEach((r: any) => endMap.set(r.event_id, r.end_ts));

        const totals = new Map<string, number>();
        (starts ?? []).forEach((s: any) => {
          const endTs = endMap.get(s.event_id);
          if (!endTs) return;
          const mins = minutesBetween(s.start_ts, endTs);
          if (mins === null) return;
          const d = new Date(s.start_ts);
          const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
            d.getUTCDate(),
          ).padStart(2, "0")}`;
          totals.set(key, (totals.get(key) ?? 0) + mins);
        });

        const result = Array.from(totals.entries())
          .sort((a, b) => (a[0] < b[0] ? 1 : -1))
          .map(([usage_date, total_usage_minutes]) => ({
            usage_date,
            total_usage_minutes,
          }));

        return json(result, 200);
      }

      return json({ error: "Not found" }, 404);
    }

    // GET /events/item/:item_id
    if (req.method === "GET" && rest[0] === "events" && rest[1] === "item") {
      const itemId = rest[2];
      if (!itemId) return json({ error: "Invalid item_id" }, 400);

      const owned = await ensureItemOwned(supabase, userId, itemId);
      if (!owned) return json({ error: "Forbidden" }, 403);

      const { data: starts, error: sErr } = await supabase
        .from("event_start")
        .select("event_id, start_ts")
        .eq("item_id", itemId)
        .order("start_ts", { ascending: false });

      if (sErr) throw sErr;

      const eventIds = (starts ?? []).map((r: any) => r.event_id);
      const { data: ends, error: eErr } = eventIds.length
        ? await supabase.from("event_end").select("event_id, end_ts").in("event_id", eventIds)
        : { data: [], error: null };

      if (eErr) throw eErr;

      const endMap = new Map<number, string>();
      (ends ?? []).forEach((r: any) => endMap.set(r.event_id, r.end_ts));

      const result = (starts ?? []).map((s: any) => ({
        event_id: s.event_id,
        start_ts: s.start_ts,
        end_ts: endMap.get(s.event_id) ?? null,
      }));

      return json(result, 200);
    }

    // PUT /start  (expects { event_id, start_ts })
    if (req.method === "PUT" && rest[0] === "start") {
      const body = (await req.json().catch(() => ({}))) as { event_id?: number; start_ts?: string };
      const eventId = parseId(String(body.event_id ?? ""));
      const startTs = body.start_ts;

      if (!eventId || !startTs) return json({ message: "No start_ts provided" }, 400);
      const { data: startRow, error: sErr } = await supabase
        .from("event_start")
        .select("event_id, item_id")
        .eq("event_id", eventId)
        .single();

      if (sErr || !startRow) return json({ error: "Start event not found" }, 404);

      const owned = await ensureItemOwned(supabase, userId, (startRow as any).item_id);
      if (!owned) return json({ error: "Forbidden" }, 403);

      const { error } = await supabase
        .from("event_start")
        .update({ start_ts: startTs })
        .eq("event_id", eventId);

      if (error) throw error;

      return json({ message: "Start event updated" }, 200);
    }

    // PUT /end/:event_id (expects { end_ts })
    if (req.method === "PUT" && rest[0] === "end") {
      const eventId = parseId(rest[1]);
      const body = (await req.json().catch(() => ({}))) as { end_ts?: string };
      const endTs = body.end_ts;

      if (!eventId) return json({ error: "Invalid event_id" }, 400);
      if (!endTs) return json({ message: "No end_ts provided" }, 400);

      const { data: startRow, error: sErr } = await supabase
        .from("event_start")
        .select("event_id, item_id")
        .eq("event_id", eventId)
        .single();

      if (sErr || !startRow) return json({ error: "Start event not found" }, 404);

      const owned = await ensureItemOwned(supabase, userId, (startRow as any).item_id);
      if (!owned) return json({ error: "Forbidden" }, 403);

      const { error } = await supabase
        .from("event_end")
        .update({ end_ts: endTs })
        .eq("event_id", eventId);

      if (error) throw error;

      return json({ message: "End event updated" }, 200);
    }

    // GET /events/by_date/:start_date
    if (req.method === "GET" && rest[0] === "events" && rest[1] === "by_date") {
      const startDate = rest[2];
      if (!startDate) return json({ message: "start_date query parameter is required" }, 400);

      const { startIso, endIso } = dayRangeUtc(startDate);

      const { data: items, error: itemsErr } = await supabase
        .from("items")
        .select("id, nickname, property_id, properties!inner(user_id)")
        .eq("properties.user_id", userId)
        .order("nickname", { ascending: true });

      if (itemsErr) throw itemsErr;

      const itemIds = (items ?? []).map((i: any) => i.id);
      if (itemIds.length === 0) return json([], 200);

      const nickByItemId = new Map<number, string>();
      (items ?? []).forEach((i: any) => nickByItemId.set(i.id, i.nickname));

      const { data: starts, error: sErr } = await supabase
        .from("event_start")
        .select("event_id, item_id, start_ts")
        .in("item_id", itemIds)
        .gte("start_ts", startIso)
        .lt("start_ts", endIso)
        .order("start_ts", { ascending: false });

      if (sErr) throw sErr;

      const eventIds = (starts ?? []).map((r: any) => r.event_id);
      const { data: ends, error: eErr } = eventIds.length
        ? await supabase.from("event_end").select("event_id, end_ts").in("event_id", eventIds)
        : { data: [], error: null };

      if (eErr) throw eErr;

      const endMap = new Map<number, string>();
      (ends ?? []).forEach((r: any) => endMap.set(r.event_id, r.end_ts));

      const grouped = new Map<string, { usage_date: string; nickname: string; events: any[] }>();

      (starts ?? []).forEach((s: any) => {
        const nickname = nickByItemId.get(s.item_id) ?? "Unknown";
        const endTs = endMap.get(s.event_id) ?? null;
        const elapsed = endTs ? minutesBetween(s.start_ts, endTs) : null;

        const key = `${startDate}||${nickname}`;
        if (!grouped.has(key)) grouped.set(key, { usage_date: startDate, nickname, events: [] });

        grouped.get(key)!.events.push({
          event_id: s.event_id,
          start_ts: s.start_ts,
          end_ts: endTs,
          elapsed_minutes: elapsed,
        });
      });

      const result = Array.from(grouped.values()).sort((a, b) => a.nickname.localeCompare(b.nickname));
      return json(result, 200);
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    return json({ message: err instanceof Error ? err.message : String(err) }, 500);
  }
});