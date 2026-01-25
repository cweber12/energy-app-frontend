// src/services/groupEvents.ts
import { GroupedEvents, HourlyTotals } from "../../types/eventTypes";

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

export async function fetchEventsByDate(
    startDate: string
): Promise<GroupedEvents[]> {
    const response = 
    await fetch(`http://127.0.0.1:5000/item_usage_events/by_date/${startDate}`);
    if (!response.ok) throw new Error("Failed to fetch events by date");
    return response.json();
}