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

## Testing

### Test stack

- **Framework**: Jest via `react-scripts test` (Create React App)
- **Libraries**: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- **Test command**: `cd frontend && npm test -- --watchAll=false`
- **Test location**: test files live next to the source files they cover, e.g. `src/utils/dateUtils.test.ts` beside `src/utils/dateUtils.ts`

### Test conventions

- Mock `src/lib/supabaseClient` in any test that renders a component calling `supabase.auth.*` directly.
- Mock individual `src/supabase_services/*` modules in hook tests rather than mocking the Supabase SDK globally.
- `window.matchMedia` and Supabase env-var stubs are already configured in `src/setupTests.js` — do not duplicate them in individual test files.
- Prefer behaviour-focused assertions (`getByText`, `getByRole`, `waitFor`) over snapshot tests.
- Use `renderHook` + `act` / `waitFor` from `@testing-library/react` for custom-hook tests.

### Required test execution before finalising any change

**This rule is mandatory. Do not skip it.**

Whenever you make code changes — regardless of how small — you MUST run the relevant tests before considering the task complete. Specifically:

1. **Determine scope**: identify which test files cover the changed modules. When in doubt, run the full suite.
2. **Run tests**:
   ```
   cd frontend && npm test -- --watchAll=false
   ```
   For a focused run on specific files:
   ```
   cd frontend && npm test -- --watchAll=false --testPathPattern="<pattern>"
   ```
3. **Review failures**: if any test fails, fix the cause — either correct the code change or update the test if the change intentionally alters the contract.
4. **Broader regression check**: when a change touches shared logic (utilities, hooks, context, types), run the full suite, not just the file-level tests.
5. **Report results**: in your completion summary, state which test command(s) were run and whether all tests passed. Do not claim the task is complete if tests have not been run or if failures remain unresolved.

Do not stop at file edits alone — always run the tests, then create the commit as the final step.

## After Completing Changes

1. Run all relevant tests (see **Required test execution** above) and confirm they pass.
2. Review the full `git diff` of all modified, added, and deleted files.
3. Write a concise, descriptive commit message that summarises the actual changes made (not a generic message like "update files"). Reference the areas changed, e.g.:

   ```
   docs: rewrite root and frontend READMEs; add lint script and ESLint improvements
   ```

4. Run `git add -A` and `git commit -m "<message>"` to create the commit automatically.

Do not stop at file edits alone — always run the tests and create the commit as the final step.

