// src/components/common/Card.tsx
import React from 'react';
import "../../App.css";
import "../Components.css";
import { useTheme } from "../../context/ThemeContext";

/*  Card Component
--------------------------------------------------------------------------------
Description: Reusable component that wraps content with consistent styling.
Props: 
    - children: React nodes to be wrapped.
------------------------------------------------------------------------------*/
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        className="card" 
        style={{ backgroundColor: colors.secondaryBackground, color: colors.secondaryText }}
        >
        {children}
    </div>
  );
}

export default Card;