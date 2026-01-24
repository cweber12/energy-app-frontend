// src/components/report/EventGraph.tsx
import React from "react";
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
import { useEventsByDate } from "../../hooks/useEventsByDate";

/* Event Graph Component
--------------------------------------------------------------------------------
Generates a stacked bar chart of total elapsed time per item by hour for a given 
date. 
Props:
    - startDate: Date string (YYYY-MM-DD) to filter events.
------------------------------------------------------------------------------*/
const EventStackedGraph: React.FC<{ startDate: string }> = ({ startDate }) => {
    const { colors } = useTheme();
    // Data structure for chart
    const { chartData, nicknames } = useEventsByDate(startDate);
    
    /* Render stacked bar chart
    ----------------------------------------------------------------------------
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