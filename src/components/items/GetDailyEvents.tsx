import React, { useEffect, useState } from "react";
import "../Components.css";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";

type UsageEvent = {
  event_id: number;
  start_ts: string;
  end_ts: string | null;
};

const groupEventsByDate = (events: UsageEvent[]) => {
    const grouped: { [date: string]: UsageEvent[] } = {};
    events.forEach(event => {
        const dateKey = new Date(event.start_ts).toISOString().slice(0, 10); // "YYYY-MM-DD"
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(event);
    });
    return grouped;
};

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

const GetDailyEvents: React.FC<{ itemId: number }> = ({ itemId }) => {
    const { colors } = useTheme();
    const [usageEvents, setUsageEvents] = useState<UsageEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsageEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/item_usage_events/item/${itemId}`
            );
            if (!response.ok) {
                throw new Error(`Error fetching usage events: ${response.statusText}`);
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

    const groupedEvents = groupEventsByDate(usageEvents);

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