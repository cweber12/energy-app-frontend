# Components Directory

This folder contains all reusable and page-specific React components for the WattWatch frontend.

## Structure Overview

### `button/`

| File | Description |
|---|---|
| `CustomButton.tsx` | Themed button primitive used throughout the app; supports disabled, hover, and submit states |
| `OpenDemo.tsx` | One-click button that logs into a shared demo account |
| `ToggleUsageEvent.tsx` | Start/stop button for recording an item usage event |
| `UploadUsageReport.tsx` | Triggers parsing and uploading of an SDGE interval CSV file |

### `common/`

Shared layout and UI primitives used across multiple pages.

| File | Description |
|---|---|
| `AuthFormWrapper.tsx` | Styled wrapper for authentication forms (login / register) |
| `Card.tsx` | Generic themed card container |
| `CardHeader.tsx` | Titled header bar for `Card` components |
| `FormWrapper.tsx` | Wrapper that applies consistent padding and colour to any form |
| `GraphWrapper.tsx` | Wrapper that provides consistent layout for chart components |
| `HeaderDropdown.tsx` | Dropdown select component styled to match the app theme |
| `HomeWrapper.tsx` | Centred layout wrapper for the Home page |
| `PageWrapper.tsx` | Full-page layout wrapper for the Account Dashboard |

### `form/`

| File | Description |
|---|---|
| `ItemInput.tsx` | Form for adding a new electrical item (category, usage type, nickname, wattage) |
| `Login.tsx` | Email/password login form using React Hook Form |
| `PropertyInput.tsx` | Form for adding a new property (address fields) |
| `Register.tsx` | New-user registration form using React Hook Form |

### `graph/`

| File | Description |
|---|---|
| `EventGraph.tsx` | Recharts bar chart displaying item events over a time period |
| `UsageGraph.tsx` | Recharts bar chart displaying hourly kWh interval readings |

### `header/`

| File | Description |
|---|---|
| `AccountDashboardHeader.tsx` | Header for the authenticated dashboard; includes property selector and logout |
| `HomeHeader.tsx` | Header for the landing/home page |

### `menu/`

| File | Description |
|---|---|
| `ItemMenu.tsx` | Lists electrical items for a property; supports selecting an active item |
| `PropertyMenu.tsx` | Dropdown-based menu for selecting or adding a property |

### `report/`

| File | Description |
|---|---|
| `EventReport.tsx` | Displays a summary report of usage events |
| `ItemEventsReport.tsx` | Shows event history for a specific item |
| `LastUseReport.tsx` | Shows the most recent start/stop event for each item |
| `UsageReport.tsx` | Main usage report card; combines kWh readings with navigation controls |

## Notes

- All components are written in TypeScript (`.tsx`) and use functional React patterns with hooks.
- Theme colours are consumed via the `useTheme()` hook from `src/context/ThemeContext.tsx`.
- Shared layout primitives (`common/`) are intentionally kept generic so they can be reused across different feature areas.

