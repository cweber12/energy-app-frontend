// src/components/common/PageWrapper.tsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";
import "../../App.css";
import "../Components.css";

/*  PageWrapper Component
--------------------------------------------------------------------------------
Description: Wrapper component that applies consistent styling to pages.
Props: 
    - children: React nodes to be wrapped.
------------------------------------------------------------------------------*/
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colors } = useTheme();

  return (
    <div 
        className="page-wrapper" 
        style={{ backgroundColor: colors.background, color: colors.title }}
        >
        {children}
    </div>
  );
};

export default PageWrapper;