// src/components/headers/HomeHeader.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../../styles/Components.css";

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
                justifyContent: "flex-start",
                gap: "2rem",
                height: "150px",

            }}
            >
            <img
                src={`${process.env.PUBLIC_URL}/watt-watch-logo.png`}
                alt="WattWatch Logo"
                style={{ height: "120px"}}
            />
        </header>
    );
}

export default HomeHeader;