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
    button: string;
    buttonHover: string;
    buttonText: string;
    buttonDisabled: string;
    icon: string;
    popupBackground: string;
    popupText: string;
    
};

export const ColorScheme = {

    dark: {
        text: "#EEEEEE",
        title: "#ff9d00",
        warning: "#f42323",
        listItemBackground: "#ffffff",
        listItemText: "#000000",      
        background: "#000000",
        navBackground: "#121214",
        dropdownBackground: "#000000",
        cardBackground: "#1E3E62",
        cardText: "#FFFFFF",
        popupBackground: "#ffffff",
        popupText: "#000000",
        button: "#008BFF",
        buttonHover: "#00559a",
        buttonDisabled: "#444444",
        buttonText: "#000000", 
        icon: "#008BFF",

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
        icon: "#000000",
    },

}