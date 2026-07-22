# Canned Cloud Agent tickets

Three realistic, self-contained tickets an FE can paste into a **Cursor Cloud Agent** during
the meeting for a live "watch the agent work" moment. Each is scoped to this codebase, happy-path
only, and written so an agent can implement it cleanly in one pass.

Repo context an agent should know:

- **Stack:** Vite + React + TypeScript, plain CSS in `src/styles.css`. No backend/APIs.
- **State** lives in `src/App.tsx` (screens, `order`, tracker `status`, `theme`,
  `autoAdvance`) and is persisted to `localStorage` under `demo-pizza-tracker/v1`.
- **Pricing/order model:** `src/lib/order.ts` + `src/types.ts`. Menu data: `src/data/menu.ts`.
- **Tracker steps/progress:** `src/lib/tracker.ts`. Tracker UI: `src/components/TrackerScreen.tsx`.
- Run `npm run build` (typecheck + build) before finishing; strict TS is on.

---

## Ticket 1 — Add tip percentage on checkout

**Goal:** Let the customer add a tip at checkout; the tip flows into the order total and shows on
the tracker summary.

**Where:**

- `src/components/CheckoutScreen.tsx` — add a "Tip" field.
- `src/types.ts` — add `tip: number` to `Order` (and thread the chosen tip into `buildOrder`).
- `src/lib/order.ts` — include tip in `total` inside `buildOrder`.
- `src/components/TrackerScreen.tsx` — show a "Tip" line in the order summary.
- `src/styles.css` — reuse existing `.chip` / `.summary-row` styles.

**Requirements:**

- Preset tip options: **15% / 18% / 20% / No tip**, plus an optional custom dollar amount.
- Tip is calculated on the **subtotal** (not incl. tax/delivery fee).
- Show the selected tip as its own line in both the checkout summary and the tracker summary.
- Default selection: **18%**. Carryout orders should still allow a tip.
- Update the displayed **Total** live as the tip changes.

**Acceptance:**

- Selecting a tip updates the total immediately on checkout.
- After placing the order, the tracker summary shows the tip line and the correct grand total.
- `npm run build` passes (strict TypeScript, no unused vars).

---

## Ticket 2 — Show driver ETA on tracker

**Goal:** When an order is **Out for delivery**, show a named driver and a live "arriving in
N min" ETA on the tracker.

**Where:**

- `src/components/TrackerScreen.tsx` — add a driver card that appears only for the
  `out-for-delivery` status (and optionally a "delivered by {driver}" note when delivered).
- `src/lib/order.ts` — add a small helper to pick a mock driver name (e.g. from a fixed list)
  when the order is built; store it on the `Order` (add `driverName: string` in `src/types.ts`).
- `src/styles.css` — a `.driver-card` style consistent with the existing tracker cards.

**Requirements:**

- Only render the driver card for **delivery** orders (not carryout).
- Show driver **name**, a friendly avatar/emoji, the **vehicle** (mock, e.g. "Blue Honda Civic"),
  and a live **"Arriving in N min"** that counts down using the existing ETA logic in
  `TrackerScreen` (`minutesRemaining` / `arriveBy`).
- Keep it purely mock/deterministic — no maps or geolocation.

**Acceptance:**

- Advancing to **Out for delivery** reveals the driver card with a counting-down ETA.
- Carryout orders never show a driver card.
- `npm run build` passes.

---

## Ticket 3 — Add a dedicated dark mode for the tracker

**Goal:** The app already has a global light/dark toggle. Make the **tracker** feel first-class
in dark mode with a persistent, high-contrast tracker theme suited to conference rooms.

**Where:**

- `src/styles.css` — refine the `[data-theme="dark"]` tracker styles (hero, steps, progress bar,
  controls) for stronger contrast; ensure the active/done/todo step states are clearly
  distinguishable in the dark.
- `src/App.tsx` — the `theme` state + `localStorage` persistence already exist; ensure the
  tracker respects it and that the choice sticks across reloads.
- Optional: add a small "high contrast" affordance in the tracker controls row.

**Requirements:**

- Dark theme must pass a reasonable contrast bar (readable step labels/blurbs on projectors).
- The progress bar, active-step pulse, and "Delivered" state remain legible in dark mode.
- Theme choice persists across refresh (it already saves to `localStorage`).
- Don't regress the light theme.

**Acceptance:**

- Toggling 🌙 dark mode on the tracker looks intentional and high-contrast (not just inverted).
- Reloading keeps the chosen theme.
- `npm run build` passes.
