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
import { formatIsoInLA } from "../../utils/dateUtils";

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

    const thStyle = {
        backgroundColor: colors.tertiaryBackground,
        color: colors.tertiaryText,
    };

    const tdStyles = {
        backgroundColor: colors.secondaryBackground,
        color: colors.secondaryText,
    };

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
            
        <div style={{width: "100%"}}>
          
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
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Start Time</th>
                                <th style={thStyle}>End Time</th>
                                <th style={thStyle}>Elapsed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(groupedEvents).map(([date, events]) =>
                                events.map((event, idx) => (
                                    <tr key={`${date}-${event.event_id}`}>
                                        <td style={tdStyles}>{idx === 0 ? date : ""}</td>
                                        <td style={tdStyles}>{formatIsoInLA(event.start_ts)}</td>
                                        <td style={tdStyles}>
                                        {event.end_ts ? formatIsoInLA(event.end_ts) : "Ongoing"}
                                        </td>
                                        <td style={tdStyles}>{formatElapsed(event.start_ts, event.end_ts)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
            )}
        </div>
            
    );
};

export default ItemEventsReport;