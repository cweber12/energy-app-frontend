// src/components/common/CardHeader.tsx
import React from 'react';
import "../../App.css";
import "../../styles/Components.css";
import { useTheme } from "../../context/ThemeContext";

/*  Card Header Component
--------------------------------------------------------------------------------
Description: Header for Card components with consistent styling.
------------------------------------------------------------------------------*/
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        className="card-header" 
        style={{ 
          color: colors.tertiaryText, 
          backgroundColor: colors.tertiaryBackground,
          borderBottom: `1px solid ${colors.border}`, 
        }}
    >
        {children}
    </div>
  );
}

export default CardHeader;