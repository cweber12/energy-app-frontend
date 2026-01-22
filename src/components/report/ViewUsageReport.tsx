import React from 'react';
import "../../App.css";
import "../Components.css";
import Card from '../common/Card';

type IntervalReading = {
    hour: string;
    kWh: number;
};

const ViewUsageReport: React.FC<{ readings: IntervalReading[] }> = ({ readings }) => {
   
    return (
        <Card> 
            {readings.length > 0 && (
                <table className="usage-events-table" style={{ marginTop: "1rem" }}>
                    <thead>
                        <tr>
                            <th>Hour</th>
                            <th>kWh</th>
                        </tr>
                    </thead>
                    <tbody>
                        {readings.map((r, idx) => (
                            <tr key={idx}>
                                <td>{r.hour}</td>
                                <td>{r.kWh.toFixed(3)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Card>
    );
}

export default ViewUsageReport;