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
import Card from '../common/Card';
import "../../App.css";
import "../Components.css";
import { useTheme } from '../../context/ThemeContext';

type IntervalReading = {
    hour: string;
    kWh: number;
};

const UsageGraph: React.FC<{ 
    readings: IntervalReading[], 
    date: string
}> = ({ readings, date }) => {
    const { colors } = useTheme();
    console.log("UsageGraph readings:", readings);
    return (
        <Card>
            <h2 style={{marginBottom: "1rem"}}>Hourly Usage (kWh) : {date}</h2>
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
        </Card>
    );
};

export default UsageGraph;