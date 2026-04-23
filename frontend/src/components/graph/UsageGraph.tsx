// src/components/graph/UsageGraph.tsx
import React from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
} from 'recharts';
import GraphWrapper from '../common/GraphWrapper';
import Card from '../common/Card';
import "../../App.css";
import "../../styles/Components.css";
import { useTheme } from '../../context/ThemeContext';
import type { IntervalReading } from '../../../types/reportTypes';

/* Usage Graph Component
--------------------------------------------------------------------------------
Generates a bar chart of kWh usage per hour for a given date.
Props | readings: IntervalReading[] - Array of usage readings
      | date: string - Date of the usage report
------------------------------------------------------------------------------*/
const UsageGraph: React.FC<{ 
    readings: IntervalReading[], 
    date: string
}> = ({ readings, date }) => {
    const { colors } = useTheme();

    /* Render bar chart
    ----------------------------------------------------------------------------
    XAxis | Hour of day
    YAxis | kWh usage
    Tooltip shows kWh value on hover.
    --------------------------------------------------------------------------*/
    return (
        <>
            <h3 className="graph-header" style={{ color: colors.mutedText }}>Hourly Meter Reading</h3>
            <GraphWrapper>
                {readings.length > 0 && (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={readings} margin={{ top: 8, right: 12, bottom: 20, left: 0 }}>
                            <XAxis 
                                dataKey="hour" 
                                tick={{ fontSize: 11, fill: colors.mutedText }}
                                label={{ value: "Hour", position: "insideBottom", offset: -8, fontSize: 11 }}
                            />
                            <YAxis 
                                tick={{ fontSize: 11, fill: colors.mutedText }}
                                label={{ value: "kWh", angle: -90, position: "insideLeft", fontSize: 11 }}
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
                            />
                            <Bar dataKey="kWh" fill={colors.graph} name="kWh" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </GraphWrapper>
        </>
    );
};

export default UsageGraph;