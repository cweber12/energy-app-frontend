// src/types/themeTypes.ts

/* Color Scheme Type
--------------------------------------------------------------------------------
Defines the structure for color scheme objects used in theming.
------------------------------------------------------------------------------*/
export type ColorSchemeType = {
    title: string;
    warning: string;
    primaryText: string;
    secondaryText: string;
    tertiaryText: string;
    mutedText: string;
    primaryBackground: string;
    secondaryBackground: string;
    tertiaryBackground: string;
    border: string;
    button: string;
    buttonHover: string;
    buttonText: string;
    buttonDisabled: string;
    buttonStart: string;
    buttonStartHover: string;
    buttonStop: string;
    buttonStopHover: string;
    iconPrimary: string;
    iconSecondary: string;
    iconTertiary: string;
    graph: string;
    graphStacked: string[];  
};

/* Theme Context Type
--------------------------------------------------------------------------------
Defines the structure for the Theme Context used for theming.
------------------------------------------------------------------------------*/
export type ThemeContextType = {
  colors: ColorSchemeType;
  scheme: "light" | "dark";
};