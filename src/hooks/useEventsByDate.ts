import { useState, useEffect } from "react";
import { groupEventsByHour } from "../services/eventService";
import { fetchEventsByDate } from "../services/eventService";


// Type definition for event object
export type Event = {
    event_id: number; // identifies start/end event pair
    start_ts: string; // ISO-8601 string ("2024-06-15T14:30:00Z")
    end_ts: string | null; // ISO-8601 string or null
    elapsed_minutes: number; // total time in minutes
};

// Type definition for grouped event by date and item nickname
export type GroupedEvent = {
    usage_date: string; // "2024-06-15"
    nickname: string; // (Fridge, Washer, etc.)
    events: Event[]; // array of events for that item on that date
};

/* Fetch Events By Date Hook
--------------------------------------------------------------------------------
Description: Fetches items for a given propertyId grouped by date and item 
nickname. Then groups events by hour for chart display. 
Params:
    - propertyId: ID of the property to fetch events for.
Returns:    
    - chartData: Array of HourlyTotals objects for charting.
    - nicknames: Array of unique item nicknames found in the data.
------------------------------------------------------------------------------*/
export function useEventsByDate(startDate: string) {
    const [data, setData] = useState<GroupedEvent[]>([]);
    
    useEffect(() => {
        fetchEventsByDate(startDate)
            .then(setData)
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
