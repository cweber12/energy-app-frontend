// src/context/ThemeContext.tsx
import React, { createContext, useContext } from "react";
import { useColorScheme } from "../hooks/useColorScheme";
import { ColorScheme } from "../styles/ColorScheme";
import type { ColorSchemeType } from "../styles/ColorScheme";

/* Context: ThemeContext
--------------------------------------------------------------------------------
    Description: This context provides the current color scheme (light or dark)
    and the corresponding color values to the entire application.
------------------------------------------------------------------------------*/

type ThemeContextType = {
  colors: ColorSchemeType;
  scheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scheme = useColorScheme();
  const colors = ColorScheme[scheme];

  return (
    <ThemeContext.Provider value={{ colors, scheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};