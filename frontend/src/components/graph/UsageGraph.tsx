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
import "../../App.css";
import "../../styles/Components.css";
import { useTheme } from '../../context/ThemeContext';

// Type for individual interval reading (from energy provider)
type IntervalReading = {
    hour: string;
    kWh: number;
};

/* Usage Graph Component
--------------------------------------------------------------------------------
Generates a bar chart of kWh usage per hour for a given date.
Props:
    - readings: Array of interval readings (IntervalReading)).
    - date: Date string (YYYY-MM-DD) to display in the title.
------------------------------------------------------------------------------*/
const UsageGraph: React.FC<{ 
    readings: IntervalReading[], 
    date: string
}> = ({ readings, date }) => {
    const { colors } = useTheme();

    /* Render bar chart
    ----------------------------------------------------------------------------
        - XAxis: Hour of day
        - YAxis: kWh usage
        - Tooltip shows kWh value on hover.
    --------------------------------------------------------------------------*/
    return (
        <GraphWrapper>
            <h2 style={{ marginBottom: "1rem" }}>Hourly Usage Report | {date}</h2>
            {readings.length > 0 && (
                <ResponsiveContainer width={800} height={400}>
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
    );
};

export default UsageGraph;