
# WattWatch — Home Energy Tracker

WattWatch is a web application for tracking home energy consumption. Users register electrical items (appliances, devices, etc.), record when those items are in use, and compare estimated usage against utility bills by uploading SDGE interval-usage CSV reports. The dashboard visualizes daily energy readings alongside recorded item events to help identify which devices are driving consumption.

## Features

- **User authentication** — register, log in, and demo-account access via Supabase Auth
- **Properties** — manage one or more home addresses tied to a user account
- **Electrical items** — add appliances/devices with category, usage type, and rated wattage
- **Usage events** — start and stop item usage sessions; view event history per item and per date
- **Usage reports** — upload SDGE interval CSV files; browse saved daily reports with previous/next navigation
- **Data visualization** — hourly kWh bar chart (Recharts) overlaid with item event timelines
- **Dark/light theme** — auto-detected from the OS `prefers-color-scheme` preference

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 (Create React App) |
| Language | TypeScript 4 |
| Routing | React Router v7 |
| Forms | React Hook Form |
| Charts | Recharts |
| Icons | React Icons |
| Backend / database | Supabase (PostgreSQL + Auth) |
| Backend functions | Supabase Edge Functions (Deno / TypeScript) |
| Hosting | GitHub Pages (via `gh-pages` deploy action) |
| Linting | ESLint 8 with `eslint-config-react-app`, `@typescript-eslint`, and `plugin:react/recommended` |

## Repository Structure

```
energy_app/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml     # CI/CD: build and deploy to GitHub Pages
├── frontend/                    # React client application
│   ├── public/                  # Static assets and HTML template
│   ├── src/
│   │   ├── components/          # UI components (button, common, form, graph, header, menu, report)
│   │   ├── config/              # Supabase environment variable config
│   │   ├── constants/           # Color scheme definitions
│   │   ├── context/             # React context providers (ThemeContext)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Supabase client initialisation
│   │   ├── pages/               # Top-level page components (Home, AccountDashboard)
│   │   ├── styles/              # Global and component CSS
│   │   ├── supabase_services/   # Functions that call Supabase Edge Function endpoints
│   │   └── utils/               # Date and event utility functions
│   ├── types/                   # Shared TypeScript type definitions
│   ├── eslint.config.js         # ESLint flat config
│   ├── package.json
│   └── tsconfig.json
└── supabase/
    ├── deno.json                # Deno import map for Edge Functions
    ├── functions/               # Supabase Edge Functions (one folder per function)
    │   ├── events/              # GET/POST item usage events
    │   ├── items/               # CRUD for electrical items
    │   ├── meter/               # CRUD for utility meters
    │   ├── properties/          # CRUD for user properties
    │   ├── usage_interval/      # Bulk insert/read interval readings
    │   └── usage_report/        # CRUD for daily usage reports
    └── migrations/              # Supabase database migration files
```

## Architecture Overview

```
Browser (React SPA)
  │
  ├─ Supabase Auth  ──────────────────────────────► Supabase Auth service
  │                                                  (session stored in sessionStorage)
  │
  └─ supabase_services/ (fetch calls with JWT)
       │
       ▼
  Supabase Edge Functions  (Deno runtime)
       │
       ▼
  Supabase PostgreSQL database
       (properties → meters → usage_reports → usage_intervals)
       (properties → items → events)
```

- The React app never calls the Supabase database directly for domain data; all writes and reads go through Edge Functions, which validate ownership before every query.
- Supabase Auth JWTs are passed as `Authorization: Bearer <token>` headers to every Edge Function.
- The app is a single-page application deployed to GitHub Pages with a `homepage` configured in `package.json`.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for deploying Edge Functions)
- A Supabase project with the schema applied (see `supabase/migrations/`)

## Setup and Installation

1. **Clone the repository**

   ```sh
   git clone <repo-url>
   cd energy_app
   ```

2. **Install frontend dependencies**

   ```sh
   cd frontend
   npm install
   ```

3. **Configure environment variables**

   Create `frontend/.env.local` (already in `.gitignore`) and add:

   ```env
   REACT_APP_SUPABASE_URL=https://<your-project-ref>.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>
   ```

   Both values are available in your Supabase project's **Settings → API** page.

4. **Apply database migrations**

   ```sh
   npx supabase db push
   ```

5. **Deploy Edge Functions**

   From the project root:

   ```sh
   npx supabase functions deploy events
   npx supabase functions deploy items
   npx supabase functions deploy meter
   npx supabase functions deploy properties
   npx supabase functions deploy usage_interval
   npx supabase functions deploy usage_report
   ```

## Development Workflow

Run the React development server (hot-reload, port 3000):

```sh
cd frontend
npm start
```

Run tests (Jest via `react-scripts`):

```sh
npm test
```

Run the linter:

```sh
npm run lint
```

Build a production bundle:

```sh
npm run build
```

## Linting and Code Quality

ESLint is configured via `frontend/eslint.config.js` (ESLint v8 flat config). The configuration includes:

- `eslint-config-react-app` base rules
- `plugin:react/recommended` (React-specific rules, `react/react-in-jsx-scope` disabled for React 17+ JSX transform)
- `plugin:@typescript-eslint/recommended` (TypeScript-aware rules)

Run:

```sh
cd frontend
npm run lint
```

## Deployment

The app is deployed to **GitHub Pages** automatically on every push to `main` via `.github/workflows/deploy-pages.yml`. The workflow:

1. Installs dependencies (`npm ci`)
2. Builds the React app (`npm run build`) using `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` secrets set in GitHub repository settings
3. Uploads the `frontend/build` folder and deploys it to the `github-pages` environment

The `homepage` field in `frontend/package.json` controls the base URL for the built assets.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_SUPABASE_URL` | Yes | Supabase project REST/auth base URL |
| `REACT_APP_SUPABASE_ANON_KEY` | Yes | Supabase project anonymous API key |

For local development, add these to `frontend/.env.local`. For CI/CD, add them as GitHub Actions secrets.

## Assumptions and Limitations

- Usage reports are currently scoped to **SDGE** as the utility provider. The data model supports other utilities but the UI does not expose a utility selector.
- The app stores the authenticated user ID in `sessionStorage`; clearing the session or closing the tab logs the user out.
- Database migrations are committed as empty placeholders; the schema must be applied manually or via `supabase db push` against the actual Supabase project.
