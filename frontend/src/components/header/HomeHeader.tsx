// src/components/headers/HomeHeader.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../../styles/Components.css";
import OpenDemo from "../button/OpenDemo";

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
            style={{
                backgroundColor: colors.secondaryBackground,
                color: colors.secondaryText,
                alignItems: "center",

            }}
            >
            <h1 style={{ color: colors.title}}>
                WattWatch
            </h1>
            <OpenDemo />
        </header>
    );
}

export default HomeHeader;