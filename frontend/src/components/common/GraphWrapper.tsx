// src/components/common/Card.tsx
import React from 'react';
import "../../App.css";
import "../../styles/Components.css";
import { useTheme } from "../../context/ThemeContext";

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        style={{ 
            backgroundColor: colors.tertiaryBackground, 
            color: colors.tertiaryText, 
            padding: "1rem", 
            boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`,
        }}
        >
        {children}
    </div>
  );
}

export default Card;