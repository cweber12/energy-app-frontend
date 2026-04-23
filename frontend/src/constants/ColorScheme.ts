// src/constants/ColorScheme.ts

import { ColorSchemeType } from "../../types/themeTypes";

/*  Color Scheme Definitions
--------------------------------------------------------------------------------
All style-based colour tokens reference CSS custom properties defined in
src/styles/theme.css. The active theme is switched by writing a data-theme
attribute on <html> (done by useColorScheme.ts), so theme changes are
handled entirely in CSS with no JavaScript colour lookups at runtime.

Chart fill colours (graph, graphStacked) must remain as resolved hex values
because SVG presentation attributes do not evaluate CSS custom properties.
------------------------------------------------------------------------------*/

// CSS variable references for every non-chart colour token.
// The resolved values live in src/styles/theme.css and switch
// automatically with the data-theme attribute.
const CSS_VAR_COLORS = {
    title:               "var(--color-accent)",
    warning:             "var(--color-text-warning)",
    primaryText:         "var(--color-text-primary)",
    secondaryText:       "var(--color-text-secondary)",
    tertiaryText:        "var(--color-text-tertiary)",
    mutedText:           "var(--color-text-muted)",
    primaryBackground:   "var(--color-surface-primary)",
    secondaryBackground: "var(--color-surface-secondary)",
    tertiaryBackground:  "var(--color-surface-tertiary)",
    border:              "var(--color-border)",
    button:              "var(--color-btn-default)",
    buttonHover:         "var(--color-btn-hover)",
    buttonDisabled:      "var(--color-btn-disabled)",
    buttonText:          "var(--color-btn-text)",
    buttonStart:         "var(--color-btn-start)",
    buttonStartHover:    "var(--color-btn-start-hover)",
    buttonStop:          "var(--color-btn-stop)",
    buttonStopHover:     "var(--color-btn-stop-hover)",
    iconPrimary:         "var(--color-icon-primary)",
    iconSecondary:       "var(--color-icon-secondary)",
    iconTertiary:        "var(--color-icon-tertiary)",
};

export const ColorScheme: { dark: ColorSchemeType; light: ColorSchemeType } = {

    dark: {
        ...CSS_VAR_COLORS,
        // SVG fill attributes do not resolve CSS custom properties,
        // so chart colours are kept as hardcoded hex values per theme.
        graph: "#22D3EE",       /* electric cyan */
        graphStacked: [
            "#22D3EE",          /* cyan */
            "#34D399",          /* emerald */
            "#FBBF24",          /* amber */
            "#F97316",          /* orange */
            "#A78BFA",          /* violet */
        ],
    },

    light: {
        ...CSS_VAR_COLORS,
        graph: "#1456B8",       /* utility blue */
        graphStacked: [
            "#1456B8",          /* blue */
            "#059669",          /* emerald */
            "#D97706",          /* amber */
            "#DC4E1F",          /* red-orange */
            "#7C3AED",          /* violet */
        ],
    },

}