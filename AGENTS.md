# AGENTS.md

## Cursor Cloud specific instructions

Single service: a Vite + React + TypeScript SPA (the "Demo Pizza Tracker"). No backend, database, auth, or external APIs — all state lives in React + `localStorage`.

- Package manager is npm (`package-lock.json`). Requires Node 18+ (works on Node 22).
- Dev server: `npm run dev` (Vite on port 5173, `host: true`). Use this for development, not the production build.
- Other scripts live in `package.json`: `npm run build` (typecheck + prod build), `npm run preview` (serve prod build), `npm run typecheck` (types only).
- There is no lint script and no automated test suite; "checks" are `npm run typecheck` and `npm run build`.
- Verify changes manually in the browser via the order → checkout → tracker flow (see the demo script in `README.md`). The tracker auto-advances every ~6s; use the ⚙︎ debug panel to jump to a status or reset between runs.
