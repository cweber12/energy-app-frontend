// src/styles/Colors.ts

/*  Colors Module
--------------------------------------------------------------------------------
    Description: This module defines color schemes for light and dark modes.
    It exports a Colors object containing color values for various UI elements.
------------------------------------------------------------------------------*/

export type ColorSchemeType = {
    text: string;
    title: string;
    warning: string;
    listItemBackground: string;
    listItemText: string;
    background: string;
    navBackground: string;
    dropdownBackground: string;
    cardBackground: string;
    cardText: string;
    popupBackground: string;
    popupText: string;
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
        text: "#EEEEEE",
        title: "#fcffe5",
        warning: "#FF0B55",
        listItemBackground: "#ffffff",
        listItemText: "#000000",      
        background: "#757575",
        navBackground: "#121214",
        dropdownBackground: "#000000",
        cardBackground: "#171717",
        cardText: "#FFFFFF",
        popupBackground: "#ffffff",
        popupText: "#000000",
        button: "#259dff",
        buttonHover: "#00559a",
        buttonDisabled: "#444444",
        buttonText: "#000000",
        buttonStart: "#73c833",
        buttonStartHover: "#1e7e34",
        buttonStop: "#cc3a3a",
        buttonStopHover: "#bd2130", 
        icon: "#0e0e0e",
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
        text: "#FFFFFF",
        title: "#FF6500",
        warning: "#FF6500",       
        listItemBackground: "#f0f0f0",
        listItemText: "#000000",
        background: "#222222",
        navBackground: "#121214",
        dropdownBackground: "#1E3E62",
        cardBackground: "#1E3E62",
        cardText: "#FFFFFF",
        popupBackground: "#000000",
        popupText: "#FFFFFF",
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