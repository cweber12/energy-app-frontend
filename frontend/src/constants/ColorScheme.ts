// src/styles/Colors.ts
import type { ColorSchemeType } from "../../types/themeTypes";

/*  Color Scheme Definitions
--------------------------------------------------------------------------------
Defines color schemes for dark and light themes.
------------------------------------------------------------------------------*/

export const ColorScheme : { dark: ColorSchemeType; light: ColorSchemeType } = {

    dark: {
        title: "#E4FF30",
        warning: "#FF0B55",
        primaryText: "#FFFFFF",
        secondaryText: "#EEEEEE",
        tertiaryText: "#000000",
        mutedText: "#e7e7e7",
        primaryBackground: "#0f0f0f", 
        secondaryBackground: "#000000",
        tertiaryBackground: "#FFFFFF",    
        button: "#008BFF",
        buttonHover: "#00559a",
        buttonDisabled: "#444444",
        buttonText: "#000000",
        buttonStop: "#cc3a3a",
        buttonStopHover: "#bd2130", 
        iconPrimary: "#E4FF30",
        iconSecondary: "#FFFFFF",
        iconTertiary: "#000000",
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
        title: "#E5BA41",
        warning: "#D1855C",
        primaryText: "#000000",
        secondaryText: "#000000",
        tertiaryText: "#E5BA41", 
        mutedText: "#888888",      
        primaryBackground: "#FFFFFF",
        secondaryBackground: "#94A378",
        tertiaryBackground: "#2D3C59",
        button: "#8dad50",
        buttonHover: "#6c7757",
        buttonText: "#000000",
        buttonDisabled: "#444444",
        buttonStop: "#D1855C",
        buttonStopHover: "#8a583d",
        iconPrimary: "#2D3C59", 
        iconSecondary: "#000000",
        iconTertiary: "#D1855C",
        graph: "#E4FF30",
        graphStacked: [
            "#FF5733",
            "#33FF57",
            "#3357FF",
            "#F333FF",
            "#33FFF5",
        ],
    },

}