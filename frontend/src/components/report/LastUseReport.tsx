// src/components/items/DailyUseReport.tsx
import React, { useEffect, useState } from "react";
import { useDailyTotalsByDate } from "../../hooks/useEvent";
import "../../App.css";
import "../../styles/Components.css";

type DailyUsage = {
  usage_date: string; // Date of usage
  total_usage_minutes: number; // Total usage time in minutes
};

/* DailyUseReport Component
--------------------------------------------------------------------------------
Description: Fetches and displays daily usage totals for a given item.
Props:
    - itemId: ID of the electrical item to fetch usage for.
------------------------------------------------------------------------------*/
const LastUseReport: React.FC<{ itemId: number }> = ({ itemId }) => {
    
    /* Fetch daily usage data when itemId changes
    ----------------------------------------------------------------------------
    - Sends GET request to backend API to fetch daily usage totals for the item
    - Populates dailyUsage state variable with the result
    --------------------------------------------------------------------------*/
    const { data: dailyUsage } = useDailyTotalsByDate(itemId);

    const latestUsage = dailyUsage.length > 0
        ? [...dailyUsage].sort((a, b) => b.usage_date.localeCompare(a.usage_date))[0]
        : null;

    /* Render daily usage totals
    ----------------------------------------------------------------------------
    - Displays a list of dates with corresponding total usage time in minutes
    --------------------------------------------------------------------------*/
    return (
        <div>
            {latestUsage && (
            <div className="daily-usage-report">
                <p style={{margin: 0}}>
                    <strong>Last use : </strong>  
                    {new Date(latestUsage.usage_date).toLocaleDateString()}<br/> 
                    <strong>Duration : </strong>
                    {latestUsage.total_usage_minutes.toFixed(2)} minutes
                </p>
            </div>
            )}
        </div>
    );
};

export default LastUseReport;