// src/components/report/EventGraph.tsx
import React, { useEffect, useState } from "react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    CartesianGrid, 
    Legend 
} from 'recharts';
import Card from "../common/Card";
import { useTheme } from "../../context/ThemeContext";

type Event = {
    event_id: number; // identifies start/end event pair
    start_ts: string; // ISO-8601 string ("2024-06-15T14:30:00Z")
    end_ts: string | null; // ISO-8601 string or null
    elapsed_minutes: number; // total time in minutes
};

type GroupedEvent = {
    usage_date: string; // "2024-06-15"
    nickname: string; // (Fridge, Washer, etc.)
    events: Event[]; // array of events for that item on that date
};

type HourlyTotals = {
    hour: string;
    [nickname: string]: number | string; // total time per item
};

/* Helper function to group events by hour and sum elapsed minutes per item 
------------------------------------------------------------------------------*/
function groupEventsByHour(data: GroupedEvent[]): HourlyTotals[] {
    // Create hours array: "00:00", "01:00", ..., "23:00"
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

/* Event Graph Component
--------------------------------------------------------------------------------
Generates a stacked bar chart of total elapsed time per item by hour for a given 
date. Used to compare item usage to kWh usage per hour chart downloaded from 
the utility provider.
------------------------------------------------------------------------------*/
const EventStackedGraph: React.FC<{ startDate: string }> = ({ startDate }) => {
    const { colors } = useTheme();
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
                setError("Failed to fetch event data");
                setLoading(false);
            });
    }, [startDate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Prepare data for stacked bar chart
    const chartData = groupEventsByHour(data);
    const nicknames = Array.from(new Set(data.flatMap(
        g => g.nickname ? [g.nickname] : [])));

    /* Render stacked bar chart
        - Each bar represents an hour of the day (00:00 to 23:00).
        - Each segment in the bar represents total elapsed time (in minutes) for 
          a specific item (nickname) during that hour.
        - Colors are assigned from the theme's graphStacked color array.
        - XAxis: Hour of day
        - YAxis: Total time in minutes
        - Tooltip shows breakdown of total time per item on hover.
    --------------------------------------------------------------------------*/
    return (
        <Card>
            <h2 style={{marginBottom: "1rem"}}>Hourly Total Time (min) : {startDate}</h2>
            <ResponsiveContainer width={800} height={400}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" label={{ value: "Hour", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Total Time (min)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                        contentStyle={{ background: "#fff", color: "#000", border: `1px solid #000` }}
                        itemStyle={{ color: "#000" }}
                        formatter={(value, name) => [`${value} min`, name]}
                    />
                    
                    <Legend />

                    {nicknames.map((nick, idx) => (
                        <Bar
                            key={nick}
                            dataKey={nick}
                            stackId="a"
                            fill={colors.graphStacked?.[idx % colors.graphStacked.length] || colors.graph}
                            name={nick}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default EventStackedGraph;