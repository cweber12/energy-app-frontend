// src/components/items/GetDailyEvents.tsx
import React, { useEffect, useState } from "react";
import "../../styles/Components.css";
import { useTheme } from "../../context/ThemeContext";
import { groupEventsByDate, formatElapsed } from "../../utils/eventUtils";
import { EventSummary } from "../../../types/eventTypes";
import "../../App.css";
import "../../styles/Components.css";
import { useAllEvents } from "../../hooks/useEvent";
import Card from "../common/Card";
import { IoMdAddCircleOutline, IoMdClose } from "react-icons/io";

/* GetDailyEvents Component
--------------------------------------------------------------------------------
Description: Fetches and displays usage events for an item, grouped by date in a 
table format. Rendered when the user presses View All button in ItemMenu info
dropdown.   
Props:
    - itemId: ID of the electrical item to fetch usage events for.
------------------------------------------------------------------------------*/
const ItemEventsReport: React.FC<{ 
    itemId: number,
    itemNickname: string,
    setShowDailyEvents: React.Dispatch<React.SetStateAction<boolean>>

}> = ({ itemId, itemNickname, setShowDailyEvents }) => {
    const { colors } = useTheme();
    const [usageEvents, setUsageEvents] = useState<EventSummary[]>([]);

    /* Fetch usage events when itemId changes
    ----------------------------------------------------------------------------
    - Sends GET request to backend API to fetch usage events for the item
    - Populates usageEvents state variable with the result
    --------------------------------------------------------------------------*/
    const { data, loading, error } = useAllEvents(itemId);

    // Group usage events by date for rendering
    const groupedEvents = groupEventsByDate(data);

    /* Render usage events grouped by date
    ----------------------------------------------------------------------------
    - Displays a table of usage events with Date, Start Time, End Time, Elapsed
    --------------------------------------------------------------------------*/
    return (
            
        <Card>
            <div className="card-header">
                <h2>{itemNickname} Uses</h2>
                <IoMdClose
                    style={{
                        cursor: "pointer",
                        color: colors.iconSecondary,
                        width: "32px",
                        height: "32px",
                    }}
                    onClick={() => setShowDailyEvents(false)}
                />
            </div>

            
            
            {loading && (
                <div className="card-header">
                    <p>Loading usage events...</p>
                </div>
            )}
            {error && (
                <div className="card-header">
                    <p>Error loading usage events: {error}</p>
                </div>
            )}
            {(!loading && !error && data.length === 0) && (
                <div className="card-header">
                    <p>No usage events found for this item.</p>
                </div>
            )}

            {!loading && !error && data.length > 0 && (
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
            )}
        </Card>
            
    );
};

export default ItemEventsReport;