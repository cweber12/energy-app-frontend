// src/services/groupEvents.ts
import { EventSummary, GroupedEvents, HourlyTotals } from "../../types/eventTypes";

export async function fetchEventsByDate(
    startDate: string
): Promise<GroupedEvents[]> {
    const response = 
    await fetch(`http://127.0.0.1:5000/item_usage_events/by_date/${startDate}`);
    if (!response.ok) throw new Error("Failed to fetch events by date");
    return response.json();
}

/* Helper function to group events by date 
--------------------------------------------------------------------------------
Parameters | events: EventSummary[] array of event summaries.
--------------------------------------------------------------------------------
Returns    | Object with dates as keys and arrays of EventSummary as values.
------------------------------------------------------------------------------*/
export const groupEventsByDate = (events: EventSummary[]) => {
    const grouped: { [date: string]: EventSummary[] } = {};
    events.forEach(event => {
        const dateKey = new Date(event.start_ts).toISOString().slice(0, 10); 
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(event);
    });
    return grouped;
};

/* Helper function to group events by hour and sum elapsed minutes per item 
--------------------------------------------------------------------------------
Parameters | data: GroupedEvents[] array of grouped event data.
--------------------------------------------------------------------------------
Returns    | HourlyTotals[] array for charting
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

export const formatElapsed = (start: string, end: string | null) => {
    if (!end) return "Ongoing";
    const startDate = new Date(start);
    const endDate = new Date(end);
    const ms = endDate.getTime() - startDate.getTime();
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const remMin = min % 60;
    if (hr === 0 && remMin === 0) {
        return `${sec % 60}s`;
    } else if (hr === 0) {
        return `${remMin}m ${sec % 60}s`;
    } else {
        return `${hr}h ${remMin}m ${sec % 60}s`;
    }
};
