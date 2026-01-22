import React from 'react';
import "../../App.css";
import "../Components.css";
import { useTheme } from "../../context/ThemeContext";

/*  Card Component
--------------------------------------------------------------------------------
    Description: Reusable component that wraps content with consistent styling.
------------------------------------------------------------------------------*/

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        className="card" 
        style={{ backgroundColor: colors.cardBackground, color: colors.text }}
        >
        {children}
    </div>
  );
}

export default Card;