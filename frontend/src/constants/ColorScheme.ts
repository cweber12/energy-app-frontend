// src/styles/Colors.ts

import { ColorSchemeType } from "../../types/themeTypes";

/*  Color Scheme Definitions
--------------------------------------------------------------------------------
Defines color schemes for dark and light themes.
------------------------------------------------------------------------------*/
export const ColorScheme : { dark: ColorSchemeType; light: ColorSchemeType } = {

    dark: {
        title: "#DFFF00", 
        warning: "#FF0B55",
        primaryText: "#F1F1F1",
        secondaryText: "#EEEEEE",
        tertiaryText: "#F1F1F1",
        mutedText: "#e7e7e7",
        primaryBackground: "#000000", 
        secondaryBackground: "#000000",
        tertiaryBackground: "#080808",  
        border: "#121212",  
        button: "#080808",
        buttonHover: "#000000",
        buttonDisabled: "#222222",
        buttonText: "#F1F1F1",
        buttonStart: "#F1F1F1",
        buttonStartHover: "#bbbbbb",
        buttonStop: "#fb5c13",
        buttonStopHover: "#c74a10", 
        iconPrimary: "#EEEEEE",
        iconSecondary: "#EEEEEE",
        iconTertiary: "#EEEEEE",
        graph: "#DFFF00",
        graphStacked: [
            "#ff2f00",
            "#00ff2f",
            "#0084ff",
            "#f6ff00",
            "#a600ff",
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
        tertiaryBackground: "#EFEFEF",
        border: "#DEDEDE",
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