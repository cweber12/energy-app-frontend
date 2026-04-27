# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands should be run from the `frontend/` directory unless otherwise specified.

```bash
npm start                          # Dev server on localhost:3000 (hot reload)
npm test -- --watchAll=false       # Run full test suite (must pass before committing)
npm run lint                       # ESLint across all .ts/.tsx files (must pass before committing)
npm run build                      # Production bundle → frontend/build/
```

**Deploy Edge Functions** (from repo root, requires Supabase CLI):
```bash
npx supabase functions deploy <name>   # names: events, items, meter, properties, usage_interval, usage_report
npx supabase db push                   # Apply migrations
```

## Architecture Overview

WattWatch is a React SPA (GitHub Pages) backed by Supabase (PostgreSQL + Deno Edge Functions). The frontend never queries the database directly — all data access is mediated through six Edge Functions that validate JWT ownership before returning data.

### Data model

```
User (Supabase Auth)
  └─ Property
      ├─ Item (appliance) → Event (start/stop sessions)
      └─ Meter → UsageReport → UsageInterval (hourly kWh)
```

Lookup tables `item_category` and `usage_type` are queried directly via the Supabase client (no Edge Function needed, no ownership).

### Frontend layers

```
pages/          → Route-level components (Home, AccountDashboard)
components/     → UI building blocks (form/, graph/, menu/, header/, button/, common/)
hooks/          → Data fetching + state. Call supabase_services/, never Supabase directly.
supabase_services/ → Edge Function wrappers. Each helper calls authedFetch() which attaches the JWT.
types/          → Shared TypeScript types (propertyTypes, itemTypes, eventTypes, reportTypes, …)
utils/          → dateUtils (LA timezone helpers), eventUtils (event→chart aggregation)
styles/         → theme.css (CSS custom properties), Components.css
```

### Routing

`HashRouter` is used for GitHub Pages compatibility. Only two routes: `/` (Home/auth) and `/account` (AccountDashboard, lazy-loaded so Recharts stays out of the initial bundle).

### Authentication flow

1. Supabase Auth issues a JWT on login/register.
2. `user_id` is stored in `sessionStorage`.
3. Every Edge Function request carries `Authorization: Bearer <JWT>`.
4. JWT is retrieved via `supabase.auth.getSession()` inside `authedFetch()` in each service module — never pass tokens manually.

### Theming

All components consume colors through `useTheme()` (from `ThemeContext`). Never hardcode colors. CSS custom properties in `styles/theme.css` drive light/dark mode via the `data-theme` attribute set by `useColorScheme()`. Recharts hex values come from the same theme context.

## Key Conventions

- **Types** live in `frontend/types/`, not co-located with components.
- **Hooks** orchestrate fetching and call `supabase_services/` functions; components call hooks.
- **Direct Supabase client** usage is allowed only for lookup tables (`item_category`, `usage_type`) that have no ownership concern.
- **Edge Functions** (Deno/TypeScript in `supabase/functions/`) each validate that the authenticated user owns the resource before returning or mutating data.
- TypeScript strict mode is on (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- Tests live beside source files. Mock `supabaseClient` and `supabase_services` modules; use behavior-focused assertions (`getByText`, `getByRole`, `waitFor`); no snapshots.

## Environment Variables

Required at build time (stored in `.env` at root and `frontend/.env.local`):
```
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
```
Validation is in `frontend/src/config/supabase.ts`.
