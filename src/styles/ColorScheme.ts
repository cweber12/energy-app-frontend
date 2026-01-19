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
    background: string;
    navBackground: string;
    dropdownBackground: string;
    button: string;
    buttonHover: string;
    buttonText: string;
    buttonDisabled: string;
};

export const ColorScheme = {

    dark: {
        text: "#EEEEEE",
        title: "#e2f2ff",
        warning: "#FF6500",
        background: "#222222",
        navBackground: "#121214",
        dropdownBackground: "#1E3E62",
        button: "#008BFF",
        buttonHover: "#00559a",
        buttonDisabled: "#444444",
        buttonText: "#000000", 

    },

    light: {
        text: "#EEEEEE",
        title: "#e2f2ff",
        warning: "#FF6500",
        background: "#222222",
        navBackground: "#121214",
        dropdownBackground: "#1E3E62",
        button: "#008BFF",
        buttonHover: "#00559a",
        buttonText: "#000000",
        buttonDisabled: "#444444",
    },

}