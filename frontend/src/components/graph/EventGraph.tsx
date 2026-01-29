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
import { useTheme } from "../../context/ThemeContext";
import { useEventsByDate } from "../../hooks/useEvent";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { groupEventsByHour } from "../../utils/eventUtils";
import GraphWrapper from "../common/GraphWrapper";
import Card from "../common/Card";
import "../../App.css";
import "../../styles/Components.css";

/* Event Graph Component
--------------------------------------------------------------------------------
Generates a stacked bar chart of total elapsed time per item by hour for a given 
date. 
Props:
    - startDate: Date string (YYYY-MM-DD) to filter events.
------------------------------------------------------------------------------*/
const EventStackedGraph: React.FC<{ startDate: string }> = ({ startDate }) => {
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    // Data structure for chart
    const { data } = useEventsByDate(startDate);
    const chartData = groupEventsByHour(data);
    const nicknames = Array.from(new Set(data.flatMap(
        g => g.nickname ? [g.nickname] : []
    )));
    
    /* Render stacked bar chart
    ----------------------------------------------------------------------------
        - XAxis: Hour of day
        - YAxis: Total time in minutes
        - Tooltip shows breakdown of total time per item on hover.
    --------------------------------------------------------------------------*/
    return (
        <>
            <h3 className="graph-header">RECORDED ITEM USE</h3>
            <GraphWrapper>
                <ResponsiveContainer width={width * 0.6} height={height * 0.3}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="0" />
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
            </GraphWrapper>
        </>
    );
};

export default EventStackedGraph;