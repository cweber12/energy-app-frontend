// src/components/headers/HomeHeader.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../Components.css";

/* Home Header Component
--------------------------------------------------------------------------------
Description: Header component for the login page.
- Currently only contains title
------------------------------------------------------------------------------*/
const HomeHeader = () => {
  const { colors } = useTheme();
    return (
        <header 
            className="header" 
            style={{backgroundColor: colors.navBackground}}
            >
            <h1 style={{ color: colors.title}}>
                WattWatch
            </h1>
            
        </header>
    );
}

export default HomeHeader;