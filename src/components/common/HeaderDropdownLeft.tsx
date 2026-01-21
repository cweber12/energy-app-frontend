import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import "../../App.css";
import "../Components.css";

/*  Header Dropdown Left Component
--------------------------------------------------------------------------------
    Description: Reusable component that wraps forms with consistent styling.
------------------------------------------------------------------------------*/

const HeaderDropdownLeft: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();
  return (
    <div 
        className="header-dropdown-left" 
        style={{ backgroundColor: colors.navBackground }}
        >
        {children}
    </div>
  );
}

export default HeaderDropdownLeft;