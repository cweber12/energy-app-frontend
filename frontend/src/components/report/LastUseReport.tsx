import React from "react";
import { useDailyTotalsByDate } from "../../hooks/useEvent";
import "../../App.css";
import "../../styles/Components.css";
import { formatLocalYmdAsMDY } from "../../utils/dateUtils";

type DailyUsage = {
  usage_date: string;
  total_usage_minutes: number;
};

const LastUseReport: React.FC<{ itemId: number }> = ({ itemId }) => {
    const { data: dailyUsage } = useDailyTotalsByDate(itemId);
    const latestUsage =
        dailyUsage.length > 0
        ? [...dailyUsage].sort((a, b) => b.usage_date.localeCompare(a.usage_date))[0]
        : null;

    if (!latestUsage) return null;

    return (
        <div className="item-meta">
            <span>Last used {formatLocalYmdAsMDY(latestUsage.usage_date)}</span>
            <span>{latestUsage.total_usage_minutes.toFixed(1)} min total</span>
        </div>
    );
};

export default LastUseReport;
