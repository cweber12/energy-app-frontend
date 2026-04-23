// src/components/report/EventGraph.tsx
import React from "react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    Legend 
} from 'recharts';
import { useTheme } from "../../context/ThemeContext";
import { useEventsByDate } from "../../hooks/useEvent";
import { groupEventsByHour } from "../../utils/eventUtils";
import GraphWrapper from "../common/GraphWrapper";
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
            <h3 className="graph-header" style={{ color: colors.mutedText }}>Recorded Item Use</h3>
            <GraphWrapper>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 20, left: 0 }}>
                        <XAxis 
                            dataKey="hour" 
                            tick={{ fontSize: 11, fill: colors.mutedText }}
                            label={{ value: "Hour", position: "insideBottom", offset: -8, fontSize: 11 }}
                        />
                        <YAxis 
                            tick={{ fontSize: 11, fill: colors.mutedText }}
                            label={{ value: "Time (min)", angle: -90, position: "insideLeft", fontSize: 11 }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: colors.secondaryBackground,
                                color: colors.primaryText,
                                border: `1px solid ${colors.border}`,
                                borderRadius: "var(--radius-md)",
                                fontSize: "var(--font-sm)",
                                boxShadow: "var(--shadow-md)",
                            }}
                            itemStyle={{ color: colors.primaryText }}
                            labelStyle={{ color: colors.mutedText, marginBottom: "4px" }}
                            cursor={{ fill: colors.border, opacity: 0.3 }}
                            formatter={(value, name) => [`${value} min`, name]}
                        />
                        
                        <Legend 
                            wrapperStyle={{ 
                                fontSize: "var(--font-xs)",
                                paddingTop: "var(--space-2)",
                            }} 
                        />

                        {nicknames.map((nick, idx) => (
                            <Bar
                                key={nick}
                                dataKey={nick}
                                stackId="a"
                                fill={colors.graphStacked?.[idx % colors.graphStacked.length] || colors.graph}
                                name={nick}
                                radius={idx === nicknames.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </GraphWrapper>
        </>
    );
};

export default EventStackedGraph;