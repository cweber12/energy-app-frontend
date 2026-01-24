// src/services/groupEvents.ts

import { GroupedEvent } from "../hooks/useEventsByDate";

type Event = {
    event_id: number; // identifies start/end event pair
    start_ts: string; // ISO-8601 string ("2024-06-15T14:30:00Z")
    end_ts: string | null; // ISO-8601 string or null
    elapsed_minutes: number; // total time in minutes
};

type GroupedEvents = {
    usage_date: string; // "2024-06-15"
    nickname: string; // (Fridge, Washer, etc.)
    events: Event[]; // array of events for that item on that date
};

type HourlyTotals = {
    hour: string;
    [nickname: string]: number | string; // total time per item
};

/* Helper function to group events by hour and sum elapsed minutes per item 
--------------------------------------------------------------------------------
Parameters:
- data: Array of Event objects grouped by date and nickname
Returns:    
- hourlyTotals: Array of HourlyTotals objects for each item used that hour
------------------------------------------------------------------------------*/


export function groupEventsByHour(data: GroupedEvents[]): HourlyTotals[] {
    // Create hours array: {"00:00", "01:00", ..., "23:00"}
    const hours = Array.from({ length: 24 }, (_, i) =>
        `${i.toString().padStart(2, "0")}:00`
    );
    // Get all unique nicknames
    const nicknames = Array.from(new Set(data.flatMap(
        g => g.nickname ? [g.nickname] : [])));

    // Initialize totals
    const hourlyTotals: HourlyTotals[] = hours.map(hour => {
        const obj: HourlyTotals = { hour };
        nicknames.forEach(nick => { obj[nick] = 0; });
        return obj;
    });

    // Fill totals
    data.forEach(group => {
        group.events.forEach(event => {
            const date = new Date(event.start_ts);
            const hour = date.getHours();
            const hourLabel = `${hour.toString().padStart(2, "0")}:00`;
            // Find the correct hour object
            const hourObj = hourlyTotals.find(h => h.hour === hourLabel);
            if (hourObj) {
                hourObj[group.nickname] =
                    (hourObj[group.nickname] as number) + 
                    Math.round(event.elapsed_minutes);
            }
        });
    });

    return hourlyTotals;
}

export async function fetchEventsByDate(startDate: string): Promise<GroupedEvent[]> {
    const response = await fetch(`http://127.0.0.1:5000/item_usage_events/by_date/${startDate}`);
    if (!response.ok) throw new Error("Failed to fetch events by date");
    return response.json();
}