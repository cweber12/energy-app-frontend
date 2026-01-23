import React, { useEffect, useState } from "react";
import "../Components.css";
import { useTheme } from "../../context/ThemeContext";
import Card from "../common/Card";

type DailyUsage = {
  usage_date: string;
  total_usage_minutes: number;
};

const GetDailyUse: React.FC<{ itemId: number }> = ({ itemId }) => {
  const { colors } = useTheme();
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    

  useEffect(() => {
    const fetchDailyUsage = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/item_usage_event_end/item/${itemId}/daily_usage`
        );
        if (!response.ok) {
          throw new Error(`Error fetching daily usage: ${response.statusText}`);
        }
        const data: DailyUsage[] = await response.json();
        setDailyUsage(data);
      } catch (error: any) {
        setError(error.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchDailyUsage();
    }
  }, [itemId]);

  return (
    <div>
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