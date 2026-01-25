import { useState, useEffect } from "react";
import { groupEventsByHour } from "../services/eventService";
import { fetchEventsByDate } from "../services/eventService";
import { GroupedEvents } from "../../types/eventTypes";

/* Fetch Events By Date
--------------------------------------------------------------------------------
Params:
    - startDate: Date string 
Returns:    
    - chartData: HourlyTotals[] array for charting.
    - nicknames: string[] array of unique item nicknames.
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

        const chartData = groupEventsByHour(data);
        const nicknames = Array.from(new Set(data.flatMap(
            g => g.nickname ? [g.nickname] : []
        )));

    return { chartData, nicknames };
}
