import { useCallback, useEffect, useState } from "react";
import type { IntervalReading, UsageReportMeta } from "../../types/reportTypes";
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

    const load = useCallback(
        async (args: { meterId: number; reportDate: string }) => {
        setState((s) => ({ ...s, isLoading: true, error: null }));
        try {
            const res = await fetchReportWithIntervalsByDate({
            meterId: args.meterId,
            reportDate: args.reportDate,
            });
            const readings: IntervalReading[] = (res.intervals ?? []).map((r) => ({
            hour: formatIsoHourMinuteLA(r.start_ts),
            kWh: r.kwh,
            }));
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
        } catch (e) {
            setState((s) => ({
            ...s,
            isLoading: false,
            error: e instanceof Error ? e.message : String(e),
            }));
        }
        },
        [],
    );

    // Initial load: pick meter for property -> pick most recent report -> load combined endpoint
    useEffect(() => {
        if (!propertyId) return;

        let cancelled = false;

        (async () => {
            setState((s) => ({ ...s, isLoading: true, error: null }));

            try {
                const meters = await fetchMetersByProperty(propertyId);
                if (cancelled) return;

                const meter =
                    meters.find(
                        (m) =>
                        (opts?.utility ? m.utility === opts.utility : true) &&
                        ((opts?.meterName ?? null) === (m.meter_name ?? null)),
                    ) ?? meters[0];

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
                return;
                }

                const reports = await fetchReportsByMeter(meter.meter_id);
                if (cancelled) return;

                const latest = reports[0];
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

            }
        })();

        return () => {
        cancelled = true;
        };
    }, [propertyId, refreshKey, opts?.utility, opts?.meterName, load]);


    const goPrev = useCallback(async () => {
        if (!state.meterId || !state.prev?.report_date) return;
        await load({ meterId: state.meterId, reportDate: state.prev.report_date });
    }, [state.meterId, state.prev, load]);

    const goNext = useCallback(async () => {
        if (!state.meterId || !state.next?.report_date) return;
        await load({ meterId: state.meterId, reportDate: state.next.report_date });
    }, [state.meterId, state.next, load]);

    const goToDate = useCallback(
        async (reportDate: string) => {
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
        if (state.meterId && state.date) return load({ meterId: state.meterId, reportDate: state.date });
        },
    };
}