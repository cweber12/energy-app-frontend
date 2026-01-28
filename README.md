
# Energy App Project

This project is organized into two main directories: `frontend` and `supabase`. Each serves a distinct role in the application architecture.

## Directory Overview

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

- **functions/**: Supabase Edge Functions for custom backend logic (API endpoints for events, items, properties, usage reports, etc.).
- **migrations/**: Database migration files managed by Supabase.
- **deno.json**: Deno configuration for Edge Functions.

See `supabase/README.md` for more details on the backend structure and Edge Functions.

## Getting Started

1. Install dependencies in both `frontend` and `supabase` folders.
2. Set up environment variables as needed for Supabase and the frontend.
3. Run the frontend React app and Supabase backend locally for development.

## Project Purpose

This application provides energy usage tracking, reporting, and management features for users, leveraging a modern React frontend and a scalable Supabase backend.
