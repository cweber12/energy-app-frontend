// src/styles/Colors.ts

/*  Colors Module
--------------------------------------------------------------------------------
    Description: This module defines color schemes for light and dark modes.
    It exports a Colors object containing color values for various UI elements.
------------------------------------------------------------------------------*/

export type ColorSchemeType = {
    title: string;
    warning: string;
    primaryText: string;
    secondaryText: string;
    tertiaryText: string;
    primaryBackground: string;
    secondaryBackground: string;
    tertiaryBackground: string;
    button: string;
    buttonHover: string;
    buttonText: string;
    buttonDisabled: string;
    buttonStart: string;
    buttonStartHover: string;
    buttonStop: string;
    buttonStopHover: string;
    icon: string;
    graph: string;
    graphStacked: string[];
    
    
};

export const ColorScheme = {

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
        icon: "#000000",
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
        icon: "#000000",
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