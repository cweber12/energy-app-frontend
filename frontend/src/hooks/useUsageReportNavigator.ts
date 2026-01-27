import { useCallback, useEffect, useState } from "react";
import type { IntervalReading } from "../../types/reportTypes";
import type { UsageReportMeta } from "../../types/reportTypes";
import {
  fetchMetersByProperty,
  fetchReportsByMeter,
  fetchReportWithIntervalsByDate,
} from "../supabase_services/usageReportService";
import { formatIsoHourMinuteLA } from "../utils/dateUtils";

type NavigatorState = {
  meterId: number | null;
  date: string; // used_date (YYYY-MM-DD)
  readings: IntervalReading[];
  report: UsageReportMeta | null;
  prev: UsageReportMeta | null;
  next: UsageReportMeta | null;
  isExact: boolean;
  isLoading: boolean;
  error: string | null;
};

export function useUsageReportNavigator(
    propertyId: number,
    refreshKey = 0,
    opts?: { utility?: string; meterName?: string | null },
) {
    const [state, setState] = useState<NavigatorState>({
        meterId: null,
        date: "",
        readings: [],
        report: null,
        prev: null,
        next: null,
        isExact: true,
        isLoading: false,
        error: null,
    });
    console.log("***** useUsageReportNavigator *****")
    console.log("usageReportNavigator state:", state);
    console.log("usageReportNavigator propertyId:", propertyId);
    console.log("usageReportNavigator refreshKey:", refreshKey);

    const load = useCallback(
        async (args: { meterId: number; reportDate: string }) => {
        setState((s) => ({ ...s, isLoading: true, error: null }));
        console.log("Loading report for meterId:", args.meterId, "reportDate:", args.reportDate);
        try {
            const res = await fetchReportWithIntervalsByDate({
            meterId: args.meterId,
            reportDate: args.reportDate,
            });
            console.log("Fetched report with intervals:", res);

            const readings: IntervalReading[] = (res.intervals ?? []).map((r) => ({
            hour: formatIsoHourMinuteLA(r.start_ts),
            kWh: r.kwh,
            }));
            console.log("Mapped readings:", readings);

            setState((s) => ({
            ...s,
            meterId: args.meterId,
            date: res.used_date || "",
            readings,
            report: res.report,
            prev: res.prev,
            next: res.next,
            isExact: res.is_exact,
            isLoading: false,
            error: null,
            }));
            console.log("Updated state after load:", {
            meterId: args.meterId,
            date: res.used_date || "",
            readings,
            report: res.report,
            prev: res.prev,
            next: res.next,
            isExact: res.is_exact,
            });
        } catch (e) {
            setState((s) => ({
            ...s,
            isLoading: false,
            error: e instanceof Error ? e.message : String(e),
            }));
            console.log("Error loading report:", e);
        }
        },
        [],
    );

    // Initial load: pick meter for property -> pick most recent report -> load combined endpoint
    useEffect(() => {
        console.log("useEffect triggered with propertyId:", propertyId, "refreshKey:", refreshKey, "opts:", opts);
        if (!propertyId) return;

        let cancelled = false;

        (async () => {
            setState((s) => ({ ...s, isLoading: true, error: null }));

            try {
                const meters = await fetchMetersByProperty(propertyId);
                console.log("Fetched meters for property:", meters);
                if (cancelled) return;

                const meter =
                    meters.find(
                        (m) =>
                        (opts?.utility ? m.utility === opts.utility : true) &&
                        ((opts?.meterName ?? null) === (m.meter_name ?? null)),
                    ) ?? meters[0];
                console.log("Selected meter:", meter);

                if (!meter) {
                    setState((s) => ({
                        ...s,
                        meterId: null,
                        date: "",
                        readings: [],
                        report: null,
                        prev: null,
                        next: null,
                        isExact: true,
                        isLoading: false,
                        error: null,
                }));
                console.log("No meter found for property.");
                return;
                }

                const reports = await fetchReportsByMeter(meter.meter_id);
                console.log("Fetched reports for meter:", reports);
                if (cancelled) return;

                const latest = reports[0];
                console.log("Latest report for meter:", latest);
                if (!latest) {
                setState((s) => ({
                    ...s,
                    meterId: meter.meter_id,
                    date: "",
                    readings: [],
                    report: null,
                    prev: null,
                    next: null,
                    isExact: true,
                    isLoading: false,
                    error: null,
                }));
                return;
                }

                await load({ meterId: meter.meter_id, reportDate: latest.report_date });
            } catch (e) {
                if (cancelled) return;
                setState((s) => ({
                ...s,
                isLoading: false,
                error: e instanceof Error ? e.message : String(e),
                }));
                console.log("Error in initial load:", e);
            }
        })();

        return () => {
        cancelled = true;
        };
    }, [propertyId, refreshKey, opts?.utility, opts?.meterName, load]);


    const goPrev = useCallback(async () => {
        console.log("goPrev called");
        if (!state.meterId || !state.prev?.report_date) return;
        await load({ meterId: state.meterId, reportDate: state.prev.report_date });
    }, [state.meterId, state.prev, load]);

    const goNext = useCallback(async () => {
        console.log("goNext called");
        if (!state.meterId || !state.next?.report_date) return;
        await load({ meterId: state.meterId, reportDate: state.next.report_date });
    }, [state.meterId, state.next, load]);

    const goToDate = useCallback(
        async (reportDate: string) => {
        console.log("goToDate called with reportDate:", reportDate);
        if (!state.meterId) return;
        await load({ meterId: state.meterId, reportDate });
        },
        [state.meterId, load],
    );

    return {
        ...state,
        canPrev: !!state.prev?.report_date,
        canNext: !!state.next?.report_date,
        goPrev,
        goNext,
        goToDate,
        reload: () => {
        console.log("reload called");
        if (state.meterId && state.date) return load({ meterId: state.meterId, reportDate: state.date });
        },
    };
}