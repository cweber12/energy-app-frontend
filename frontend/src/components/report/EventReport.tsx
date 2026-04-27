// src/components/report/EventReport.tsx
import React from "react";
import { useEventsByDate } from "../../hooks/useEvent";
import "../../styles/Components.css";
import Card from "../common/Card";
import "../../App.css";
import { formatIsoInLA } from "../../utils/dateUtils";

/* Event Report Component
--------------------------------------------------------------------------------
Generates a table of usage events for all items on a given date.
------------------------------------------------------------------------------*/
const EventReport: React.FC<{ startDate: string }> = ({ startDate }) => {
    /* Fetch event data when startDate changes
    --------------------------------------------------------------------------*/
    const { data, isLoading, error } = useEventsByDate(startDate);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    /* Render event report table
        - Columns: Item, Date, Start Time, End Time, Total Time (min)
        - Iterates over grouped data to populate rows.
    --------------------------------------------------------------------------*/
    return (
        <Card>
            <table className="usage-events-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Total Time (min)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((group) =>
                        group.events.map((event, idx) => (
                            <tr key={event.event_id}>
                                <td>{idx === 0 ? group.nickname : ""}</td>
                                <td>{idx === 0 ? group.usage_date : ""}</td>
                                <td>{formatIsoInLA(event.start_ts)}</td>
                                <td>{event.end_ts ? formatIsoInLA(event.end_ts) : "Ongoing"}</td>
                                <td>
                                    {event.elapsed_minutes !== null
                                        ? Math.round(event.elapsed_minutes)
                                        : "Ongoing"}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </Card>
    );
};

export default EventReport;