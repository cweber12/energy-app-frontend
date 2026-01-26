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
        primaryBackground: "#0f0f0f", 
        secondaryBackground: "#000000",
        tertiaryBackground: "#FFFFFF",    
        button: "#008BFF",
        buttonHover: "#00559a",
        buttonDisabled: "#444444",
        buttonText: "#000000",
        buttonStart: "#3CCF4E",
        buttonStartHover: "#1e7e34",
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
        title: "#FF6500",
        warning: "#FF6500",
        primaryText: "#000000",
        secondaryText: "#333333",
        tertiaryText: "#666666",       
        primaryBackground: "#FFFFFF",
        secondaryBackground: "#E0E0E0",
        tertiaryBackground: "#FFFFFF",
        button: "#008BFF",
        buttonHover: "#00559a",
        buttonText: "#000000",
        buttonDisabled: "#444444",
        buttonStart: "#28a745",
        buttonStartHover: "#1e7e34",
        buttonStop: "#dc3545",
        buttonStopHover: "#bd2130",
        iconPrimary: "#FF6500", 
        iconSecondary: "#000000",
        iconTertiary: "#666666",
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