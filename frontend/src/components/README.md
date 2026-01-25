# Components Directory Overview

This folder contains all reusable and page-level React components for the Energy App frontend. Components are grouped by feature or type for clarity and maintainability.

## Folders and Components

### action/

- **GetDailyEvents.tsx**: Fetches and displays usage events for a specific item, grouped by date.
- **GetDailyUse.tsx**: Fetches and displays daily usage totals (in minutes) for a given item.
- **SetUsageEvent.tsx**: Allows starting and ending usage events for an electrical item.
- **UploadUsageReport.tsx**: Parses and uploads XML usage reports, extracting hourly kWh readings.

### common/

- **Card.tsx**: Reusable card component for consistent content styling.
- **FormWrapper.tsx**: Wraps forms with consistent styling and background.
- **HeaderDropdown.tsx**: Dropdown wrapper for header elements.
- **PageWrapper.tsx**: Applies consistent styling to page layouts.

### form/

- **ItemInput.tsx**: Form to add a new electrical item to a property.
- **Login.tsx**: User login form with authentication.
- **PropertyInput.tsx**: Form to add a new property for a user.
- **Register.tsx**: Registration form for new user sign-up.

### graph/

- **EventGraph.tsx**: Renders a bar chart of event durations by hour for a given item/date.
- **UsageGraph.tsx**: Renders a bar chart of hourly kWh usage for a given day.

### header/

- **AccountDashboardHeader.tsx**: Header for the account dashboard, includes property and report controls.
- **HomeHeader.tsx**: Header for the home/login page, displays the app title.

### menu/

- **ItemMenu.tsx**: Menu for listing and managing electrical items for a property.
- **PropertyMenu.tsx**: Menu for selecting or adding properties.

### report/

- **EventReport.tsx**: Displays a table of usage events grouped by item and date, including start/end times and total elapsed time.
- **UsageReport.tsx**: Displays a table of hourly kWh usage readings for a given day.

---

> For styling, see `Components.css` in this folder. Most components use the ThemeContext for dynamic color schemes.
