// frontend/src/supabase_services/usageReportService.ts
import { supabase } from "../lib/supabaseClient";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";

// Type definition for interval reading
export type IntervalReading = {
  hour: string; 
  kWh: number;
};

// Type definition for usage interval input
export type UsageIntervalInput = {
  start_ts: string; // ISO
  kwh: number;
};

// Helper to get auth headers
async function getHeaders(): Promise<HeadersInit> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated");
  return {
    Authorization: `Bearer ${token}`,
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  };
}

// Generic function to call usage report related edge functions
async function fn<T>(
  fnName: "meter" | "usage_report" | "usage_interval",
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T> {
  const headers = await getHeaders();

  const init: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined && method !== "GET" && method !== "DELETE") {
    init.body = JSON.stringify(body); 
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/${fnName}${path}`, init);

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error ?? json?.message ?? `Request failed (${res.status})`);
  return json as T;
}

/* Function to parse hour string to local DateTime
--------------------------------------------------------------------------------
Params  | reportDate: string - Date in YYYY-MM-DD format
        | hourStr: string - Hour representation (e.g., "14:00", "2:00 PM")
--------------------------------------------------------------------------------
Returns | Date object representing the local date and time
------------------------------------------------------------------------------*/
export
function parseHourToLocalDateTime(reportDate: string, hourStr: string): Date {
    const trimmed = hourStr.trim();

    const m24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (m24) {
        const hh = Number(m24[1]);
        const mm = Number(m24[2]);
        return new Date(`${reportDate}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
    }

    const m12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (m12) {
        const [, hhStr, mmStr, apStr] = m12; 

        if (!hhStr || !mmStr || !apStr) {
            throw new Error(`Unrecognized hour format: ${hourStr}`);
        }

        let hh = Number(hhStr);
        const mm = Number(mmStr);
        const ap = apStr.toUpperCase();

        if (ap === "PM" && hh !== 12) hh += 12;
        if (ap === "AM" && hh === 12) hh = 0;

        return new Date(`${reportDate}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
    }

    const dt = new Date(trimmed);
    if (!Number.isNaN(dt.getTime())) return dt;

    throw new Error(`Unrecognized hour format: ${hourStr}`);
}

/* Function to ensure meter exists or create it
--------------------------------------------------------------------------------
Params  | property_id: number - ID of the property
        | utility?: string - Utility name (default: "SDGE")
        | meter_name?: string | null - Optional meter name
--------------------------------------------------------------------------------
Returns | meter_id: number - ID of the ensured or created meter
------------------------------------------------------------------------------*/
export async function ensureMeter(params: {
  property_id: number;
  utility?: string;
  meter_name?: string | null;
}): Promise<number> {
  const { property_id, utility = "SDGE", meter_name = null } = params;

  const meters = await fn<
    { meter_id: number; property_id: number; utility: string; meter_name: string | null }[]
  >("meter", `/property/${property_id}`, "GET");

  const found = meters.find((m) => m.utility === utility && (m.meter_name ?? null) === (meter_name ?? null));
  if (found) return found.meter_id;

  const created = await fn<{ meter_id: number }>("meter", "", "POST", {
    property_id,
    utility,
    meter_name,
  });
  return created.meter_id;
}

/* Function to create usage report metadata
--------------------------------------------------------------------------------
Params  | meter_id: number - ID of the meter
        | report_date: string - Date in YYYY-MM-DD format
        | interval_minutes?: number - Interval in minutes (default: 60)
        | source_filename?: string | null - Optional source filename
--------------------------------------------------------------------------------
Returns | report_id: number - ID of the created usage report
------------------------------------------------------------------------------*/
export async function createUsageReport(params: {
  meter_id: number;
  report_date: string; // YYYY-MM-DD
  interval_minutes?: number;
  source_filename?: string | null;
}): Promise<number> {
  const created = await fn<{ report_id: number }>("usage_report", "", "POST", {
    meter_id: params.meter_id,
    report_date: params.report_date,
    interval_minutes: params.interval_minutes ?? 60,
    source_filename: params.source_filename ?? null,
  });
  return created.report_id;
}

/* Function to bulk insert usage intervals
--------------------------------------------------------------------------------
Params  | report_id: number - ID of the usage report
        | intervals: UsageIntervalInput[] - Array of usage intervals
--------------------------------------------------------------------------------
Returns | { message: string; count: number } - Result of the bulk insert
------------------------------------------------------------------------------*/
export async function bulkInsertUsageIntervals(params: {
  report_id: number;
  intervals: UsageIntervalInput[];
}): Promise<{ message: string; count: number }> {
  return fn<{ message: string; count: number }>("usage_interval", "/bulk", "POST", params);
}

/* Function to upload usage report
--------------------------------------------------------------------------------
Params  | property_id: number - ID of the property
        | report_date: string - Date in YYYY-MM-DD format
        | readings: IntervalReading[] - Array of interval readings
        | interval_minutes?: number - Interval in minutes (default: 60)
        | utility?: string - Utility name (default: "SDGE")
        | meter_name?: string | null - Optional meter name
        | source_filename?: string | null - Optional source filename
--------------------------------------------------------------------------------
Returns | { meter_id: number; report_id: number; inserted: number } - Result of the upload
------------------------------------------------------------------------------*/
export async function uploadUsageReport(params: {
  property_id: number;
  report_date: string; // YYYY-MM-DD
  readings: IntervalReading[];
  interval_minutes?: number;
  utility?: string;
  meter_name?: string | null;
  source_filename?: string | null;
}): Promise<{ meter_id: number; report_id: number; inserted: number }> {
  const meter_id = await ensureMeter({
    property_id: params.property_id,
    utility: params.utility ?? "SDGE",
    meter_name: params.meter_name ?? null,
  });
  console.log("uploadUsageReport: property_id =", params.property_id);
  console.log("uploadUsageReport: ensured meter_id =", meter_id);
  const report_id = await createUsageReport({
    meter_id,
    report_date: params.report_date,
    interval_minutes: params.interval_minutes ?? 60,
    source_filename: params.source_filename ?? null,
  });
  console.log("uploadUsageReport: created report_id =", report_id);

  const intervals: UsageIntervalInput[] = params.readings.map((r) => {
    const localDt = parseHourToLocalDateTime(params.report_date, r.hour);
    return { start_ts: localDt.toISOString(), kwh: r.kWh };
  });

  const result = await bulkInsertUsageIntervals({ report_id, intervals });
  return { meter_id, report_id, inserted: result.count };
}