// src/components/graph/UsageGraph.tsx
import React from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    CartesianGrid, 
} from 'recharts';
import GraphWrapper from '../common/GraphWrapper';
import Card from '../common/Card';
import "../../App.css";
import "../../styles/Components.css";
import { useTheme } from '../../context/ThemeContext';
import type { IntervalReading } from '../../../types/reportTypes';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';

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
    const { width, height } = useWindowDimensions();

    /* Render bar chart
    ----------------------------------------------------------------------------
    XAxis | Hour of day
    YAxis | kWh usage
    Tooltip shows kWh value on hover.
    --------------------------------------------------------------------------*/
    return (
        <>
            <h3 className="graph-header">HOURLY METER READING</h3>
            <GraphWrapper>
                {readings.length > 0 && (
                    <ResponsiveContainer width={width * 0.6} height={height * 0.3}>
                        <BarChart data={readings}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" label={{ value: "Hour", position: "insideBottom", offset: -5 }} />
                            <YAxis label={{ value: "kWh", angle: -90, position: "insideLeft" }} />
                            <Tooltip
                                contentStyle={{ background: "#fff", color: "#000", border: `1px solid #000` }}
                                itemStyle={{ color: "#000" }}
                            />
                            <Bar dataKey="kWh" fill={colors.graph} name="kWh" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </GraphWrapper>
        </>
    );
};

export default UsageGraph;