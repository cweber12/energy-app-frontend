// src/styles/Colors.ts

import { ColorSchemeType } from "../../types/themeTypes";

/*  Color Scheme Definitions
--------------------------------------------------------------------------------
Defines color schemes for dark and light themes.
------------------------------------------------------------------------------*/
export const ColorScheme : { dark: ColorSchemeType; light: ColorSchemeType } = {

    dark: {
        title: "#FFD369",
        warning: "#FF0B55",
        primaryText: "#FFFFFF",
        secondaryText: "#EEEEEE",
        tertiaryText: "#FFFFFF",
        mutedText: "#e7e7e7",
        primaryBackground: "#393E46", 
        secondaryBackground: "#393E46",
        tertiaryBackground: "#222831",  
        border: "#FFFFFF",  
        button: "#3ea8ff",
        buttonHover: "#2f7fc1",
        buttonDisabled: "#444444",
        buttonText: "#000000",
        buttonStart: "#E4FF30",
        buttonStartHover: "#afc427",
        buttonStop: "#fb5c13",
        buttonStopHover: "#c74a10", 
        iconPrimary: "#EEEEEE",
        iconSecondary: "#EEEEEE",
        iconTertiary: "#EEEEEE",
        graph: "#E4FF30",
        graphStacked: [
            "#FF5733",
            "#33FF57",
            "#3357FF",
            "#fcff33",
            "#33FFF5",
        ],


    },

    light: {
        title: "#000000",
        warning: "#FF7A30",
        primaryText: "#000000",
        secondaryText: "#000000",
        tertiaryText: "#000000", 
        mutedText: "#888888",      
        primaryBackground: "#FFFFFF",
        secondaryBackground: "#FFFFFF",
        tertiaryBackground: "#EEEEEE",
        border: "#000000",
        button: "#3ea8ff",
        buttonHover: "#3d548d",
        buttonText: "#000000",
        buttonDisabled: "#b8b8b8",
        buttonStart: "#5CB85C",
        buttonStartHover: "#3d7a3d",
        buttonStop: "#D1855C",
        buttonStopHover: "#8a583d",
        iconPrimary: "#000000", 
        iconSecondary: "#000000",
        iconTertiary: "#000000",
        graph: "#06923E",
        graphStacked: [
            "#ED3F27",
            "#41A67E",
            "#134686",
            "#FEB21A",
            "#5C3E94",
        ],
    },

}