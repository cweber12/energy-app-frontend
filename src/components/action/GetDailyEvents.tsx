// src/components/items/GetDailyEvents.tsx
import React, { useEffect, useState } from "react";
import "../Components.css";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";

type UsageEvent = {
  event_id: number;
  start_ts: string;
  end_ts: string | null;
};

/* Helper function to group usage events by date
--------------------------------------------------------------------------------
- Groups an array of UsageEvent objects by their usage date (YYYY-MM-DD).
- Returns an object where keys are dates and values are arrays of UsageEvent.
------------------------------------------------------------------------------*/
const groupEventsByDate = (events: UsageEvent[]) => {
    const grouped: { [date: string]: UsageEvent[] } = {};
    events.forEach(event => {
        const dateKey = new Date(event.start_ts).toISOString().slice(0, 10); 
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(event);
    });
    return grouped;
};

/* Helper function to format elapsed time between start and end timestamps
--------------------------------------------------------------------------------
- Takes start and end ISO-8601 timestamp strings.
- Returns a formatted string showing elapsed time in h, m, s.
------------------------------------------------------------------------------*/
const formatElapsed = (start: string, end: string | null) => {
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

/* GetDailyEvents Component
--------------------------------------------------------------------------------
Description: Fetches and displays usage events for an item, grouped by date in a 
table format. Rendered when the user presses View All button in ItemMenu info
dropdown.   
Props:
    - itemId: ID of the electrical item to fetch usage events for.
------------------------------------------------------------------------------*/
const GetDailyEvents: React.FC<{ itemId: number }> = ({ itemId }) => {
    const { colors } = useTheme();
    const [usageEvents, setUsageEvents] = useState<UsageEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /* Fetch usage events when itemId changes
    ----------------------------------------------------------------------------
    - Sends GET request to backend API to fetch usage events for the item
    - Populates usageEvents state variable with the result
    --------------------------------------------------------------------------*/
    useEffect(() => {
        const fetchUsageEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/item_usage_events/item/${itemId}`
            );
            if (!response.ok) {
                throw new Error(`${response.statusText}`);
            }
            const data: UsageEvent[] = await response.json();
            setUsageEvents(data);
            } catch (error: any) {
            setError(error.message || "Unknown error");
            } finally {
            setLoading(false);
            }
        };

        if (itemId) {
            fetchUsageEvents();
        }
        }, [itemId]);

    // Group usage events by date for rendering
    const groupedEvents = groupEventsByDate(usageEvents);

    /* Render usage events grouped by date
    ----------------------------------------------------------------------------
    - Displays a table of usage events with Date, Start Time, End Time, Elapsed
    --------------------------------------------------------------------------*/
    return (
        <div>
            {loading && <p>Loading usage events...</p>}
            {error && <p style={{ color: colors.text }}>Error: {error}</p>}
            {!loading && !error && usageEvents.length === 0 && (
                <p>No usage events found for this item.</p>
            )}
            {!loading && !error && usageEvents.length > 0 && (
                <Card>
                    <h2 style={{marginBottom: "1rem"}}>Usage Events</h2>
                    <table className="usage-events-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Elapsed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(groupedEvents).map(([date, events]) =>
                                events.map((event, idx) => (
                                    <tr key={`${date}-${event.event_id}`}>
                                        <td>{idx === 0 ? date : ""}</td>
                                        <td>{new Date(event.start_ts).toLocaleTimeString()}</td>
                                        <td>
                                            {event.end_ts
                                                ? new Date(event.end_ts).toLocaleTimeString()
                                                : "Ongoing"}
                                        </td>
                                        <td>{formatElapsed(event.start_ts, event.end_ts)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </Card>
            )}
        </div>
    );
};

export default GetDailyEvents;