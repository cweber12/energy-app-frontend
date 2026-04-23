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
                gap: "1rem",
                height: "var(--home-header-height)",
            }}
            >
            <img
                src={`${process.env.PUBLIC_URL}/watt-watch-logo.png`}
                alt="WattWatch Logo"
                style={{ height: "56px" }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                <span style={{ 
                    fontSize: "var(--font-xl)",
                    fontWeight: "var(--font-weight-bold)",
                    color: colors.primaryText,
                    letterSpacing: "-0.01em",
                }}>WattWatch</span>
                <span style={{ 
                    fontSize: "var(--font-xs)",
                    color: colors.mutedText,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                }}>Energy Monitor</span>
            </div>
        </header>
    );
}

export default HomeHeader;