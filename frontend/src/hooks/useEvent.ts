import { useState, useEffect } from "react";
import { 
    fetchEventsByDate, 
    fetchAllEvents, 
    fetchItemDailyUsage, 
    fetchLastStart, 
    fetchLastEnd
} from "../supabase_services/eventsService";
import { 
    GroupedEvents, 
    EventSummary, 
    DailyUsage, 
    EventStart, 
    EventEnd
} from "../../types/eventTypes";

/* Fetch Events By Date
--------------------------------------------------------------------------------
Params  | startDate: string in 'YYYY-MM-DD' format
--------------------------------------------------------------------------------
Returns | data: GroupedEvents[] array of events grouped by date.
------------------------------------------------------------------------------*/
export function useEventsByDate(startDate: string) {
    const [data, setData] = useState<GroupedEvents[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!startDate) return;
        let cancelled = false;
        setIsLoading(true);
        setError(null);
        fetchEventsByDate(startDate)
            .then((result) => { if (!cancelled) setData(result); })
            .catch((err) => {
                if (!cancelled) {
                    console.error("Error fetching events by date:", err);
                    setError(err instanceof Error ? err.message : "Failed to fetch events");
                }
            })
            .finally(() => { if (!cancelled) setIsLoading(false); });
        return () => { cancelled = true; };
    }, [startDate]);

    return { data, isLoading, error };
}

/* Fetch Daily Totals By Date
--------------------------------------------------------------------------------
Params  | itemId: number ID of the item to fetch daily totals for.
--------------------------------------------------------------------------------
Returns | data: DailyUsage[] array of daily usage totals.
------------------------------------------------------------------------------*/
export function useDailyTotalsByDate(itemId: number) {
    const [data, setData] = useState<DailyUsage[]>([]);
    useEffect(() => {
        fetchItemDailyUsage(itemId)
            .then(setData)
            .catch((err) => {
                console.error("Error fetching daily totals by date:", err);
            });
    }, [itemId]);
    return { data };
}

/* Fetch All Events for Item
--------------------------------------------------------------------------------
Params  | itemId: number ID of the item to fetch events for.
--------------------------------------------------------------------------------
Returns | data: EventSummary[] array of all event summaries for the item.
------------------------------------------------------------------------------*/
export function useAllEvents(itemId: number) {
    const [data, setData] = useState<EventSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchAllEvents(itemId)
            .then(setData)
            .catch((err) => {
                console.error("Error fetching all events:", err);
                setError("Failed to fetch events");
            })
            .finally(() => setLoading(false));
    }, [itemId]);
    return { data, loading, error };
}

/* Fetch Last Event (Start and End) for Item
--------------------------------------------------------------------------------
Params  | itemId: number ID of the item to fetch last event for.
--------------------------------------------------------------------------------
Returns | startTs: Date | null of last event start timestamp.
        | endTs: Date | null of last event end timestamp.
        | eventId: number | null ID of the ongoing event if not ended.
------------------------------------------------------------------------------*/
export function useLastEvent(itemId: number) {
    const [, setLastStart] = useState<EventStart | null>(null);
    const [startTs, setStartTs] = useState<Date | null>(null);
    const [, setLastEnd] = useState<EventEnd | null>(null);
    const [endTs, setEndTs] = useState<Date | null>(null);
    const [eventId, setEventId] = useState<number | null>(null);

    useEffect(() => {
        if (!itemId) return;

        (async () => {
            try {
                const start = await fetchLastStart(itemId);
                setLastStart(start);
                setStartTs(new Date(start.start_ts));
                setEventId(start.event_id);

                try {
                    // fetchLastEnd takes item_id — it finds the end for the
                    // most recent start internally via the Edge Function.
                    const end = await fetchLastEnd(itemId);
                    setLastEnd(end);
                    setEndTs(new Date(end.end_ts));
                    setEventId(null); // event has ended; no ongoing event_id
                } catch {
                    // 404 means the latest start has no end → still running
                    setLastEnd(null);
                    setEndTs(null);
                }
            } catch (err) {
                console.error("Error fetching last event:", err);
            }
        })();
    }, [itemId]);

    return { startTs, endTs, eventId };
}