// src/components/report/UsageReport.tsx
import React from 'react';
import { IntervalReading } from '../../../types/reportTypes';
import "../../App.css";
import "../../styles/Components.css";
import Card from '../common/Card';

/*  Usage Report Component
--------------------------------------------------------------------------------
Description: Component to display usage report in a tabular format.
Props: 
    - readings: Array of interval readings with hour and kWh values.
------------------------------------------------------------------------------*/
const UsageReport: React.FC<{ readings: IntervalReading[] }> = ({ readings }) => {
   
    /* Render Usage Report Table
    --------------------------------------------------------------------------*/
    return (
        <Card> 
            <h2>Usage Report</h2>
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

export default UsageReport;