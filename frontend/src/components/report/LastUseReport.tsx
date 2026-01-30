import React from "react";
import { useDailyTotalsByDate } from "../../hooks/useEvent";
import "../../App.css";
import "../../styles/Components.css";
import { formatLocalYmdAsMDY } from "../../utils/dateUtils";
import { useTheme } from "../../context/ThemeContext";

type DailyUsage = {
  usage_date: string;
  total_usage_minutes: number;
};

const LastUseReport: React.FC<{ itemId: number }> = ({ itemId }) => {
    const { data: dailyUsage } = useDailyTotalsByDate(itemId);
    const { colors } = useTheme();
    const latestUsage =
        dailyUsage.length > 0
        ? [...dailyUsage].sort((a, b) => b.usage_date.localeCompare(a.usage_date))[0]
        : null;

    return (
        <div>
        {latestUsage && (
            <div className="daily-usage-report">
            <p style={{ margin: 0 }}>
                <strong style={{color: colors.title}}>Last Used On </strong>
                {formatLocalYmdAsMDY(latestUsage.usage_date)}
                <br />
                <strong style={{color: colors.title}}>Total Duration </strong>
                {latestUsage.total_usage_minutes.toFixed(2)} minutes
            </p>
            </div>
        )}
        </div>
    );
};

export default LastUseReport;