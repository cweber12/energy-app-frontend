// src/components/items/GetDailyUse.tsx
import React, { useEffect, useState } from "react";
import "../Components.css";

type DailyUsage = {
  usage_date: string; // Date of usage
  total_usage_minutes: number; // Total usage time in minutes
};

/* GetDailyUse Component
--------------------------------------------------------------------------------
Description: Fetches and displays daily usage totals for a given item.
Props:
    - itemId: ID of the electrical item to fetch usage for.
------------------------------------------------------------------------------*/
const GetDailyUse: React.FC<{ itemId: number }> = ({ itemId }) => {
    const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    /* Fetch daily usage data when itemId changes
    ----------------------------------------------------------------------------
    - Sends GET request to backend API to fetch daily usage totals for the item
    - Populates dailyUsage state variable with the result
    --------------------------------------------------------------------------*/
    useEffect(() => {
        const fetchDailyUsage = async () => {
        try {
            setLoading(true);
            const response = await fetch(
            `http://127.0.0.1:5000/item_usage_event_end/item/${itemId}/daily_usage`
            );
            if (!response.ok) {
            throw new Error(`Error fetching daily usage: ${response.statusText}`);
            }
            const data: DailyUsage[] = await response.json();
            setDailyUsage(data);
        } catch (err) {
            console.error("Error fetching daily usage:", err instanceof Error ? err.message : err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
        };

        if (itemId) {
        fetchDailyUsage();
        }
    }, [itemId]);

    /* Render daily usage totals
    ----------------------------------------------------------------------------
    - Displays a list of dates with corresponding total usage time in minutes
    --------------------------------------------------------------------------*/
    return (
        <div>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            {dailyUsage.map((usage) => (
            <li key={usage.usage_date}>
                <strong>Total Run Time | {usage.usage_date}</strong> | {usage.total_usage_minutes.toFixed(2)} minutes
            </li>
            ))}
        </ul>
        </div>
    );
};

export default GetDailyUse;