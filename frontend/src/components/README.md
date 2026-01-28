# Components Directory

This folder contains all reusable and page-specific React components for the frontend application. Components are organized by feature and type for clarity and maintainability.

## Structure Overview

- **button/**
	- `OpenDemo.tsx`: Button to open a demo modal or feature.
	- `ToggleUsageEvent.tsx`: Button to toggle usage event state.
	- `UploadUsageReport.tsx`: Button for uploading usage reports (file upload UI).

- **common/**
	- `Card.tsx`: Generic card container component.
	- `CardHeader.tsx`: Header for card components.
	- `FormWrapper.tsx`: Wrapper for form layouts and styling.
	- `GraphWrapper.tsx`: Wrapper for graph/chart components.
	- `HeaderDropdown.tsx`: Dropdown menu for headers.
	- `HomeWrapper.tsx`: Wrapper for home page layout.
	- `PageWrapper.tsx`: Wrapper for page-level layout and styling.

- **form/**
	- `ItemInput.tsx`: Input field for item data entry.
	- `Login.tsx`: User login form.
	- `PropertyInput.tsx`: Input field for property data entry.
	- `Register.tsx`: User registration form.

- **graph/**
	- `EventGraph.tsx`: Visualization of event data.
	- `UsageGraph.tsx`: Visualization of usage data.

- **header/**
	- `AccountDashboardHeader.tsx`: Header for the account dashboard page.
	- `HomeHeader.tsx`: Header for the home page.

- **menu/**
	- `ItemMenu.tsx`: Menu for item-related actions.
	- `PropertyMenu.tsx`: Menu for property-related actions.

- **report/**
	- `EventReport.tsx`: Report component for events.
	- `ItemEventsReport.tsx`: Report for item events.
	- `LastUseReport.tsx`: Report showing last usage information.
	- `UsageReport.tsx`: Main usage report component.

## Notes
- Each subfolder groups related components by feature or UI type.
- Components are written in TypeScript (`.tsx`) and use functional React patterns.
- Shared layout and UI primitives are in the `common/` folder.
- Feature-specific components are grouped by their domain (e.g., `form/`, `graph/`, `report/`).

For more details on each component, refer to the source files and their inline documentation.

