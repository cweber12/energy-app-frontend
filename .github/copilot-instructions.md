# Copilot Agent Instructions

## Project Overview

WattWatch is a React + TypeScript SPA (Create React App) backed by Supabase Edge Functions (Deno/TypeScript) and a PostgreSQL database. See the root `README.md` for full architecture and setup details.

## Repository Layout

- `frontend/` — React client (TypeScript, React Router, React Hook Form, Recharts)
- `supabase/functions/` — Supabase Edge Functions, one sub-folder per function
- `supabase/migrations/` — Database migration files
- `.github/workflows/` — GitHub Actions CI/CD

## Coding Conventions

- All frontend source files use TypeScript (`.ts` / `.tsx`).
- Shared TypeScript types live in `frontend/types/`; they are imported with a relative path from `src/`.
- Custom hooks are in `frontend/src/hooks/`. Hooks that fetch data call functions from `frontend/src/supabase_services/` rather than calling Supabase directly.
- All Supabase Edge Function calls attach a JWT obtained from `supabase.auth.getSession()`.
- React components use the `useTheme()` hook from `src/context/ThemeContext.tsx` for colours; do not hardcode colour values.
- ESLint is configured in `frontend/eslint.config.js`. Run `npm run lint` from `frontend/` before committing.

## After Completing Changes

1. Review the full `git diff` of all modified, added, and deleted files.
2. Write a concise, descriptive commit message that summarises the actual changes made (not a generic message like "update files"). Reference the areas changed, e.g.:

   ```
   docs: rewrite root and frontend READMEs; add lint script and ESLint improvements
   ```

3. Run `git add -A` and `git commit -m "<message>"` to create the commit automatically.

Do not stop at file edits alone — always create the commit as the final step.
