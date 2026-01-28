// src/components/common/FormWrapper.tsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import "../../App.css";
import "../../styles/Components.css";

/*  Header Dropdown Left Component
--------------------------------------------------------------------------------
Description: Reusable component that wraps forms with consistent styling.
Props: 
    - children: React nodes to be wrapped.
------------------------------------------------------------------------------*/
const HeaderDropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        className="header-dropdown-left" 
        style={{ 
          backgroundColor: colors.secondaryBackground, 
          color: colors.secondaryText, 
          border: `1px solid ${colors.border}` 
        }}
        >
        {children}
    </div>
  );
}

export default HeaderDropdown;