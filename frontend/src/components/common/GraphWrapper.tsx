// src/components/common/Card.tsx
import React from 'react';
import "../../App.css";
import "../../styles/Components.css";
import { useTheme } from "../../context/ThemeContext";

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        className="graph-wrapper"
        style={{ 
            backgroundColor: colors.secondaryBackground, 
            color: colors.tertiaryText, 
        }}
        >
        {children}
    </div>
  );
}

export default Card;