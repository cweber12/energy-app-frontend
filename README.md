
# Energy App (WattWatch)

This app tracks home energy consumption by recording electrical item use and comparing to uploaded energy usage reports from SDGE.

## Directory Overview

This project is organized into two main directories: `frontend` and `supabase`. Each serves a distinct role in the application architecture.

### frontend/

The React-based web application for end users. This folder contains all client-side code, including:

- **src/**: Main source code for the React app, organized by features and components.
- **public/**: Static assets and the main HTML template.
- **package.json**: Project dependencies and scripts.
- **tsconfig.json**: TypeScript configuration.
- **eslint.config.js**: Linting configuration.

See `frontend/README.md` for more details on the frontend structure.

### supabase/

The backend for the application, powered by Supabase. This folder includes:

- **functions/**: Supabase Edge Functions for connecting to tables in PostgresSQL database.
- **migrations/**: Database migration files managed by Supabase.
- **deno.json**: Deno configuration for Edge Functions.

See `supabase/README.md` for more details on the backend structure and Edge Functions.

## Getting Started

1. Install dependencies in both `frontend` and `supabase` folders.
1. Create new Supabase project and populate database.
1. Use Supabase cli to authenticate and deploy edge functions from project root with:

```sh
npx supabase functions deploy usage_report
```

1. Set up environment variables for Supabase URL and API key in frontend/.env.local (add to gitignore).
1. Add project URL and API key to frontend/.env.local, add .env.local to gitignore
1. Run frontend locally using: 

```sh
npm start
```
