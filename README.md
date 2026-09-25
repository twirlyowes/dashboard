# Pixel Villa Staff Dashboard

Internal staff dashboard for **Pixel Villa Support** (the support bot only — not connected to the premium bot). Next.js 14 (App Router), Tailwind, Firebase Admin SDK, reading the support bot's own Firestore project directly.

## What's here

- **Overview** — open ModMail count, pending DMs, top-5 activity leaderboard, admin-only Firestore quota panel
- **Warnings** — search by username or Discord ID (`.warn` data), read-only. Non-admin staff can only view their own history.
- **Staff Activity** — full leaderboard for admins; individual-only view for non-admin staff
- **ModMail** — open + recently closed tickets from the DM-based support system
- **AFK** — admins see every currently-AFK user automatically on load, no search required. Non-admin staff can only see their own status.
- **Commands** — a reference list of every command the support bot actually offers (`lib/commands.js`), grouped by category, verified directly against its real source. Display-only — nothing on this page executes anything.
- **Bot Health** — live Discord REST data (member count, approximate online count, bot account), plus last activity-reset/report timestamps

This dashboard is **read-only by design.** An earlier version of this build added warn/mute/kick/ban actions straight from the dashboard; that capability was removed entirely at the project owner's request, along with its supporting internal audit log, hierarchy-check REST wrappers, and confirmation-dialog UI. If moderation actions come back later, they're a deliberate re-addition, not a default anyone should assume is still there.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in every value — see the comments in that file for exactly what each one is and where it comes from.
   - `FIREBASE_KEY` is the entire downloaded service-account JSON pasted as one line, same convention the bot itself already uses for its own `FIREBASE_KEY`.
   - `DC_ADMINS` is a comma-separated list of Discord **user IDs** (not usernames — IDs don't change, usernames do).
3. `npm run dev` to run locally, or deploy to Render:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Set every var from `.env.example` in Render's Environment tab (not a `.env` file — same approach as the bot).

## Design decisions worth knowing about

- **No polling, anywhere.** Login is a direct Discord REST membership check, not the old Firestore-polling auth bridge. Pages fetch on request; nothing auto-refreshes in the background.
- **Two-tier caching + a request counter** (`lib/quota.js`) keep this well under the 30k/day Firestore budget — short TTL caches on frequently-viewed collections, search-only (never full-collection dumps) on Warnings/AFK, and a `count()` aggregation instead of fetching whole collections just to get a size.
- **Rate limiting** (`lib/rateLimit.js`) on login (5 attempts / 5 minutes per IP — the most attack-prone route, since it's a shared access code) and on the resolve-username API.
- **Access-level scoping** (`lib/scope.js`): admins (`DC_ADMINS`) can look up anyone; non-admin staff (`STAFF_ROLE_IDS`) can only ever see their own Warnings/Activity/AFK data, enforced server-side — not just hidden in the UI.
- **Username resolution** (`lib/discordUsers.js`): every raw Discord ID shown anywhere is resolved to a username + avatar, cached in-memory first, then Firestore (24h TTL), then Discord's API as a last resort — batched with a concurrency cap so it never hammers Discord's rate limit.
- **Command references** (`lib/commands.js`) come from one source-of-truth map verified against the bot's actual source (`.warn`, not `/warn` — this bot is prefix-based) — never hand-typed inline, so slash-vs-prefix can't silently drift. Also backs the full `/dashboard/commands` reference page.
- **Username search** (`components/UserSearchInput.js`): every search box is search-as-you-type against Discord's own member search, not a raw ID field — with a raw-ID fallback for anyone who's left the server. Debounced client-side, rate-limited server-side.
- **Quota panel** (admin-only, on Overview): live readout of today's Firestore usage against the 30k budget, using the same counter `lib/quota.js` already tracked internally. Resets every 24h or on server restart — it's a live per-instance counter, not a persisted historical log, and the panel says so.
- **Login logging**: every successful login prints `[dashboard-auth] Login: <discordId> (<level>) at <timestamp>` to the server console (visible in Render's Logs tab) — no access code or session token included.

## Before this goes live — per your own standing rule, not optional

This dashboard does **not** launch until:
- [ ] Custom domain connected
- [x] Favicon added — `app/favicon.ico`, `app/icon.png`, and `app/apple-icon.png`, generated from the actual Pixel Villa server icon (Next.js picks these up automatically, no code changes needed)
- [ ] Any "Made with AI" tag removed
- [x] Privacy policy page added — `/privacy`, linked from the login page footer
- [x] Terms and conditions page added — `/terms`, linked from the login page footer

Both are written specifically for what this dashboard actually does (not generic filler), but neither has had a real legal review — worth a read-through, and ideally a second set of eyes, before treating them as binding. The only item left that's actually mine to help with is removing any "Made with AI" tag if one exists in your hosting setup; connecting a domain is on your end.
