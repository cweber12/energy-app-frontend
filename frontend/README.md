# Frontend — WattWatch React Application

This directory contains the React single-page application (SPA) that makes up the WattWatch client. It is bootstrapped with Create React App and written in TypeScript.

## Available Scripts

Run from the `frontend/` directory:

| Command | Description |
|---|---|
| `npm start` | Starts the development server at [http://localhost:3000](http://localhost:3000) with hot-reload |
| `npm test` | Runs the Jest test suite in interactive watch mode |
| `npm run build` | Creates an optimised production bundle in `frontend/build/` |
| `npm run lint` | Runs ESLint across all source files |

## Source Layout

```
frontend/
├── public/                  # Static assets and index.html template
├── src/
│   ├── App.tsx              # Root component — router setup and ThemeProvider
│   ├── index.tsx            # React DOM entry point
│   ├── components/          # All UI components (see components/README.md)
│   ├── config/
│   │   └── supabase.ts      # Reads REACT_APP_SUPABASE_* env vars; throws if missing
│   ├── constants/
│   │   ├── ColorScheme.ts   # Dark and light color palette definitions
│   │   └── Sizes.ts         # Shared size constants
│   ├── context/
│   │   └── ThemeContext.tsx  # ThemeProvider — provides current color scheme app-wide
│   ├── hooks/               # Custom React hooks (data-fetching, UI state)
│   ├── lib/
│   │   └── supabaseClient.ts # Initialised Supabase JS client (singleton)
│   ├── pages/
│   │   ├── Home.tsx          # Landing page — login / register / demo
│   │   └── AccountDashboard.tsx  # Main authenticated dashboard
│   ├── styles/
│   │   └── Components.css   # Shared component styles
│   ├── supabase_services/   # Functions that call Supabase Edge Function HTTP endpoints
│   └── utils/
│       ├── dateUtils.ts     # Date formatting and timezone helpers (LA timezone)
│       └── eventUtils.ts    # Event data transformation helpers
└── types/                   # Shared TypeScript type definitions
    ├── authTypes.ts
    ├── eventTypes.ts
    ├── itemTypes.ts
    ├── propertyTypes.ts
    ├── reportTypes.ts
    ├── themeTypes.ts
    └── userTypes.ts
```

## Pages

### `Home`
Landing page. Displays the login form by default with a toggle to switch to the registration form. Redirects authenticated users (detected via `sessionStorage`) to `/account`. Includes an **Open Demo** button for quick access without registering.

### `AccountDashboard`
The main authenticated view. Allows users to:
- Select and manage properties via a dropdown
- Add/edit electrical items within a property
- Start/stop usage events for each item
- Browse saved daily energy reports (previous/next navigation)
- Upload a new SDGE interval CSV report
- View a Recharts bar chart of hourly kWh readings alongside item event data

## Key Hooks

| Hook | Purpose |
|---|---|
| `useProperties` | Fetches all properties for the current user |
| `useAllItems` | Fetches items, categories, and usage types for a property |
| `useEventsByDate` | Fetches item events grouped by a given date |
| `useDailyTotalsByDate` | Fetches daily kWh totals per item |
| `useUsageReportNavigator` | Manages loading and navigation between saved usage reports |
| `useSaveUsageReport` | Handles uploading a parsed CSV report to the backend |
| `useLatestUsageReport` | Fetches the most recent usage report for a property |
| `useColorScheme` | Detects OS dark/light preference via `prefers-color-scheme` |

## Supabase Services

Files in `src/supabase_services/` handle all HTTP calls to the Supabase Edge Functions. They attach a Supabase Auth JWT to every request.

| File | Edge Function(s) called |
|---|---|
| `eventsService.ts` | `events` |
| `itemsService.ts` | `items` |
| `propertiesService.ts` | `properties` |
| `usageReportService.ts` | `meter`, `usage_report`, `usage_interval` |

## Environment Variables

Create `frontend/.env.local` (excluded from source control) with:

```env
REACT_APP_SUPABASE_URL=https://<your-project-ref>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>
```

The app will throw an error on startup if either value is missing.

## Linting

ESLint is configured via `eslint.config.js` (ESLint v8 flat config) and includes React, TypeScript, and hooks rules. Run:

```sh
npm run lint
```


This directory contains CSS or other styling files used to define the visual appearance of your application. In this folder styles of different components are stored here.
