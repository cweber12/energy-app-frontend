// types/reportTypes.ts

/* Type definitions for usage reports and related data structures 
--------------------------------------------------------------------------------
This file defines TypeScript types used in the application for handling 
usage reports, interval readings, meters, and usage intervals.
------------------------------------------------------------------------------*/

export type IntervalReading = {
    hour: string;
    kWh: number;
};

export type UsageIntervalInput = {
  start_ts: string; // ISO
  kwh: number;
};

export type MeterRow = {
  meter_id: number;
  property_id: number;
  utility: string;
  meter_name: string | null;
};

export type UsageReportRow = {
  report_id: number;
  meter_id: number;
  report_date: string; // YYYY-MM-DD
  interval_minutes: number;
  source_filename: string | null;
  created_at: string;
};

export type UsageIntervalRow = {
  report_id: number;
  start_ts: string; // timestamptz ISO
  kwh: number;
};

export type UsageReportMeta = {
    report_id: number;
    meter_id: number;
    report_date: string; // YYYY-MM-DD
    interval_minutes: number;
    source_filename: string | null;
    created_at: string;
};

