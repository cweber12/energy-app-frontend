// frontend/src/hooks/useSaveUsageReport.ts
import { useCallback, useState } from "react";
import { uploadUsageReport } from "../supabase_services/usageReportService";

type IntervalReading = { 
  hour: string; 
  kWh: number 
};

type SaveArgs = {
  property_id: number;
  report_date: string;          // YYYY-MM-DD
  readings: IntervalReading[];
  interval_minutes?: number;    // default 60
  utility?: string;             // default "SDGE"
  meter_name?: string | null;   // optional
  source_filename?: string | null;
};

/* Custom hook to save usage report
--------------------------------------------------------------------------------
Returns | saveReport: function to save usage report
        | isSaving: boolean indicating if save is in progress
        | saveError: string | null error message if save failed
------------------------------------------------------------------------------*/
export function useSaveUsageReport() {
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const saveReport = useCallback(async (args: SaveArgs) => {
      setIsSaving(true);
      setSaveError(null);
      try {
        await uploadUsageReport({
          property_id: args.property_id,
          report_date: args.report_date,
          readings: args.readings,
          interval_minutes: args.interval_minutes ?? 60,
          utility: args.utility ?? "SDGE",
          meter_name: args.meter_name ?? null,
          source_filename: args.source_filename ?? null,
        });
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : String(e));
        throw e;
      } finally {
        setIsSaving(false);
      }
    }, []);

  return { saveReport, isSaving, saveError };
}