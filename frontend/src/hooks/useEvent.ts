import { useState, useEffect, use } from "react";
//import { groupEventsByHour } from "../services/eventService";
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
    HourlyTotals, 
    DailyUsage, 
    LastEvent, 
    EventStart, 
    EventEnd
} from "../../types/eventTypes";
import { set } from "react-hook-form";

/* Fetch Events By Date
--------------------------------------------------------------------------------
Params:
    - startDate: Date string 
Returns:    
    - data: GroupedEvents[]
------------------------------------------------------------------------------*/
export function useEventsByDate(startDate: string) {
    const [data, setData] = useState<GroupedEvents[]>([]);
    
    useEffect(() => {
        fetchEventsByDate(startDate)
            .then(setData)
            .catch((err) => {
                console.error("Error fetching events by date:", err);
            });
    }, [startDate]);

    return { data };
}

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

export function useLastEvent(itemId: number) {
    const [lastStart, setLastStart] = useState<EventStart | null>(null);
    const [startTs, setStartTs] = useState<Date | null>(null);
    const [lastEnd, setLastEnd] = useState<EventEnd | null>(null);
    const [endTs, setEndTs] = useState<Date | null>(null);
    const [eventId, setEventId] = useState<number | null>(null);

    useEffect(() => {
        if (!itemId) return;
        console.log("Fetching last start for itemId:", itemId);
        fetchLastStart(itemId)
            .then(setLastStart)
            .then(() => {
                if (lastStart) {
                    setEventId(lastStart.event_id);
                    setStartTs(new Date(lastStart.start_ts));
                } 
            })
            .catch((err) => {
                console.error("Error fetching last start:", err);
            });
        
    }, [itemId]);

    useEffect(() => {
        if (eventId === null) return; 
        console.log("Fetching last end for eventId:", eventId);  
        fetchLastEnd(eventId)
        .then(setLastEnd)
        .then(() => {
            if (lastEnd) {
                setEndTs(new Date(lastEnd.end_ts));
                setEventId(null); // Reset eventId to indicate event has ended
            }
        })
        .catch((err) => {
            console.log("Process still running:", err);
            setLastEnd(null);
        });

    }, [eventId]);

    return { startTs, endTs, eventId };
}