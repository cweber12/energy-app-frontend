// src/components/common/PageWrapper.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../../styles/Components.css";
import Home from "../../pages/Home";

/*  HomeWrapper Component
--------------------------------------------------------------------------------
Description: Wrapper component that applies consistent styling to pages.
Props: 
    - children: React nodes to be wrapped.
------------------------------------------------------------------------------*/
const HomeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();

  return (
    <div 
        className="home-wrapper" 
        style={{ backgroundColor: colors.primaryBackground, color: colors.primaryText }}
        >
        {children}
    </div>
  );
};

export default HomeWrapper;