// src/components/common/Card.tsx
import React from 'react';
import "../../App.css";
import "../../styles/Components.css";
import { useTheme } from "../../context/ThemeContext";

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        className="card" 
        style={{ 
            backgroundColor: colors.secondaryBackground, 
            color: colors.secondaryText, 
            padding: "1rem", 
            borderRadius: "8px",
            boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`,
        }}
        >
        {children}
    </div>
  );
}

export default Card;