// src/components/report/EventReport.tsx
import React, { useEffect, useState } from "react";
import "../Components.css";
import Card from "../common/Card";
import "../../App.css";

type Event = {
    event_id: number; // identifies start/end event pair
    start_ts: string; // ISO-8601 string ("2024-06-15T14:30:00Z")
    end_ts: string | null; // ISO-8601 string or null if ongoing
    elapsed_minutes: number; // total time in minutes
};

type GroupedEvent = {
    usage_date: string; // "2024-06-15"
    nickname: string; // (Fridge, Washer, etc.)
    events: Event[]; // array of events for that item on that date
};

/* Event Report Component
--------------------------------------------------------------------------------
Generates a table of usage events for all items on a given date.
------------------------------------------------------------------------------*/
const EventReport: React.FC<{ startDate: string }> = ({ startDate }) => {
    const [data, setData] = useState<GroupedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* Fetch event data when startDate changes
        - When client uploads .xml usage report from utiility provider, date is 
          extracted and passed as startDate prop to this component.
        - Fetches all usage events for that date from backend API.
        - Populates data state variable with the result.
    --------------------------------------------------------------------------*/
    useEffect(() => {
        setLoading(true);
        fetch(
            `http://127.0.0.1:5000/item_usage_events/by_date/${startDate}`
        )
            .then((res) => res.json())
            .then((result) => {
                setData(result);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch event data: " + err.message);
                setLoading(false);
            });
    }, [startDate]);

    if (loading) return <div>Loading...</div>;
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
                                <td>{new Date(event.start_ts).toLocaleTimeString()}</td>
                                <td>
                                    {event.end_ts
                                        ? new Date(event.end_ts).toLocaleTimeString()
                                        : "Ongoing"}
                                </td>
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