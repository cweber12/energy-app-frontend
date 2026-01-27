import { useEffect, useState } from "react";
import type { IntervalReading } from "../../types/reportTypes";
import { fetchMostRecentUsageReportForProperty } from "../supabase_services/usageReportService";

export function useLatestUsageReport(propertyId: number, refreshKey = 0) {
  const [readings, setReadings] = useState<IntervalReading[]>([]);
  const [date, setDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchMostRecentUsageReportForProperty({ propertyId, utility: "SDGE", meterName: null });
        if (cancelled) return;

        if (!result) {
          setReadings([]);
          setDate("");
          return;
        }

        setReadings(result.readings);
        setDate(result.date);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setReadings([]);
        setDate("");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [propertyId, refreshKey]);

  return { readings, date, isLoading, error };
}