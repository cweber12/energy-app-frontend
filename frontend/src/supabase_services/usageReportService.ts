// frontend/src/supabase_services/usageReportService.ts
import { SUPABASE_URL } from "../config/supabase";
import { authedFetch } from "../lib/apiFetch";
import { DEFAULT_UTILITY } from "../constants/utilities";
import type {
    IntervalReading,
    UsageIntervalInput,
    MeterRow,
    UsageReportRow,
    UsageIntervalRow,
    UsageReportMeta,
} from "../../types/reportTypes";
import {
    formatIsoHourMinuteLA,
    parseHourToLocalDateTime,
} from "../utils/dateUtils";

const FN = `${SUPABASE_URL}/functions/v1`;

/* Function to ensure meter exists or create it
--------------------------------------------------------------------------------
Params  | property_id: number - ID of the property
        | utility?: string - Utility name (default: DEFAULT_UTILITY)
        | meter_name?: string | null - Optional meter name
--------------------------------------------------------------------------------
Returns | meter_id: number - ID of the ensured or created meter
------------------------------------------------------------------------------*/
export async function ensureMeter(params: {
  property_id: number;
  utility?: string;
  meter_name?: string | null;
}): Promise<number> {
  const { property_id, utility = DEFAULT_UTILITY, meter_name = null } = params;

  const meters = await authedFetch<
    { meter_id: number; property_id: number; utility: string; meter_name: string | null }[]
  >(`${FN}/meter/property/${property_id}`);

  const found = meters.find(
    (m) => m.utility === utility && (m.meter_name ?? null) === (meter_name ?? null),
  );
  if (found) return found.meter_id;

  const created = await authedFetch<{ meter_id: number }>(`${FN}/meter`, "POST", {
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
  const created = await authedFetch<{ report_id: number }>(`${FN}/usage_report`, "POST", {
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
  return authedFetch<{ message: string; count: number }>(
    `${FN}/usage_interval/bulk`,
    "POST",
    params,
  );
}

/* Function to upload a complete usage report (meter + report + intervals)
--------------------------------------------------------------------------------
Params  | property_id: number - ID of the property
        | report_date: string - Date in YYYY-MM-DD format
        | readings: IntervalReading[] - Array of interval readings
        | interval_minutes?: number - Interval in minutes (default: 60)
        | utility?: string - Utility name (default: DEFAULT_UTILITY)
        | meter_name?: string | null - Optional meter name
        | source_filename?: string | null - Optional source filename
--------------------------------------------------------------------------------
Returns | { meter_id: number; report_id: number; inserted: number }
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
    utility: params.utility ?? DEFAULT_UTILITY,
    meter_name: params.meter_name ?? null,
  });

  const report_id = await createUsageReport({
    meter_id,
    report_date: params.report_date,
    interval_minutes: params.interval_minutes ?? 60,
    source_filename: params.source_filename ?? null,
  });

  const intervals: UsageIntervalInput[] = params.readings.map((r) => {
    const localDt = parseHourToLocalDateTime(params.report_date, r.hour);
    return { start_ts: localDt.toISOString(), kwh: r.kWh };
  });

  const result = await bulkInsertUsageIntervals({ report_id, intervals });
  return { meter_id, report_id, inserted: result.count };
}

/* Fetch meters by property
--------------------------------------------------------------------------------
Params  | propertyId: number - ID of the property
--------------------------------------------------------------------------------
Returns | MeterRow[] - Array of meters for the property
------------------------------------------------------------------------------*/
export async function fetchMetersByProperty(propertyId: number): Promise<MeterRow[]> {
  const json = await authedFetch<MeterRow[]>(`${FN}/meter/property/${propertyId}`);
  return json ?? [];
}

/* Fetch usage reports by meter
--------------------------------------------------------------------------------
Params  | meterId: number - ID of the meter
--------------------------------------------------------------------------------
Returns | UsageReportRow[] - Array of usage reports for the meter
------------------------------------------------------------------------------*/
export async function fetchReportsByMeter(meterId: number): Promise<UsageReportRow[]> {
  const json = await authedFetch<UsageReportRow[]>(`${FN}/usage_report/meter/${meterId}`);
  return json ?? [];
}

/* Fetch usage intervals by report
--------------------------------------------------------------------------------
Params  | reportId: number - ID of the usage report
--------------------------------------------------------------------------------
Returns | UsageIntervalRow[] - Array of usage intervals for the report
------------------------------------------------------------------------------*/
export async function fetchIntervalsByReport(reportId: number): Promise<UsageIntervalRow[]> {
  const json = await authedFetch<UsageIntervalRow[]>(
    `${FN}/usage_interval/report/${reportId}`,
  );
  return json ?? [];
}

/* Fetch the most recent usage report for a property
--------------------------------------------------------------------------------
Params  | propertyId: number - ID of the property
        | utility?: string - Optional utility name to filter by
        | meterName?: string | null - Optional meter name to filter by
--------------------------------------------------------------------------------
Returns | { date: string; readings: IntervalReading[] } | null
------------------------------------------------------------------------------*/
export async function fetchMostRecentUsageReportForProperty(params: {
  propertyId: number;
  utility?: string;
  meterName?: string | null;
}): Promise<{ date: string; readings: IntervalReading[] } | null> {
  const meters = await fetchMetersByProperty(params.propertyId);

  const meter =
    meters.find(
      (m) =>
        (params.utility ? m.utility === params.utility : true) &&
        (params.meterName ?? null) === (m.meter_name ?? null),
    ) ?? meters[0];

  if (!meter) return null;

  const reports = await fetchReportsByMeter(meter.meter_id);
  const latest = reports[0]; // ordered by report_date desc in the Edge Function
  if (!latest) return null;

  const intervals = await fetchIntervalsByReport(latest.report_id);

  const readings: IntervalReading[] = intervals.map((r) => ({
    hour: formatIsoHourMinuteLA(r.start_ts),
    kWh: r.kwh,
  }));

  return { date: latest.report_date, readings };
}

/* Fetch a usage report with intervals by date (with prev/next navigation)
------------------------------------------------------------------------------*/
export async function fetchReportWithIntervalsByDate(params: {
  meterId: number;
  reportDate: string; // YYYY-MM-DD
}): Promise<{
  report: UsageReportMeta | null;
  intervals: UsageIntervalRow[];
  prev: UsageReportMeta | null;
  next: UsageReportMeta | null;
  requested_date: string;
  used_date: string;
  is_exact: boolean;
}> {
  return authedFetch(
    `${FN}/usage_report/meter/${params.meterId}/date/${params.reportDate}`,
  );
}
