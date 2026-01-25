// src/components/items/GetDailyEvents.tsx
import React, { useEffect, useState } from "react";
import "../Components.css";
import { useTheme } from "../../context/ThemeContext";
import { groupEventsByDate, formatElapsed } from "../../services/eventService";
import { EventSummary } from "../../../types/eventTypes";
import Card from "../common/Card";

/* GetDailyEvents Component
--------------------------------------------------------------------------------
Description: Fetches and displays usage events for an item, grouped by date in a 
table format. Rendered when the user presses View All button in ItemMenu info
dropdown.   
Props:
    - itemId: ID of the electrical item to fetch usage events for.
------------------------------------------------------------------------------*/
const DailyEvents: React.FC<{ 
    itemId: number, 
    setShowDailyEvents: React.Dispatch<React.SetStateAction<boolean>>

}> = ({ itemId, setShowDailyEvents }) => {
    const { colors } = useTheme();
    const [usageEvents, setUsageEvents] = useState<EventSummary[]>([]);
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
            try {
                const response = await fetch(
                    `http://127.0.0.1:5000/item_usage_events/item/${itemId}`
            );
            if (!response.ok) {
                throw new Error(`${response.statusText}`);
            }
            const data: EventSummary[] = await response.json();
            setUsageEvents(data);
            } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
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
            {error && <p style={{ color: colors.primaryText }}>Error: {error}</p>}
            {!loading && !error && usageEvents.length === 0 && (
                <p>No usage events found for this item.</p>
            )}
            {!loading && !error && usageEvents.length > 0 && (
                <Card>
                    <div className="row" 
                        style={{ 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            boxSizing: "border-box",
                            width: "100%",
                            marginBottom: "1rem"
                        }}>
                        <h2>Events For Item {itemId}</h2>
                        <button 
                            onClick={() => setShowDailyEvents(false)}
                            style={{ 
                                backgroundColor: colors.button,
                                color: colors.buttonText,
                                marginLeft: "auto"
                            }}
                        >
                            Close
                        </button>
                    </div>
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

export default DailyEvents;