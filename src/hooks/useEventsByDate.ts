import { useState, useEffect } from "react";
import { groupEventsByHour } from "../services/groupEvents";

// Type definition for event object
type Event = {
    event_id: number; // identifies start/end event pair
    start_ts: string; // ISO-8601 string ("2024-06-15T14:30:00Z")
    end_ts: string | null; // ISO-8601 string or null
    elapsed_minutes: number; // total time in minutes
};

// Type definition for grouped event by date and item nickname
type GroupedEvent = {
    usage_date: string; // "2024-06-15"
    nickname: string; // (Fridge, Washer, etc.)
    events: Event[]; // array of events for that item on that date
};

/* Fetch Events By Date Hook
--------------------------------------------------------------------------------
Description: Fetches and groups events by date for a given property ID.
Params:
    - propertyId: ID of the property to fetch events for.
Returns:    
    - groupedEvents: List of events grouped by date and item nickname (GroupedEvent).
------------------------------------------------------------------------------*/
export function useEventsByDate(startDate: string) {
    const [data, setData] = useState<GroupedEvent[]>([]);
    
    useEffect(() => {
            fetch(
                `http://127.0.0.1:5000/item_usage_events/by_date/${startDate}`
            )
                .then((res) => res.json())
                .then((result) => {
                    setData(result);
      
                })
                .catch((err) => {
                    console.error("Error fetching events by date:", err);
                });
        }, [startDate]);

        const chartData = groupEventsByHour(data);
        const nicknames = Array.from(new Set(data.flatMap(
            g => g.nickname ? [g.nickname] : []
        )));

    return { chartData, nicknames };
}
