---
title: 'Sync Wishes Guestbook (Sổ Lưu Bút Chúc Phúc) via Shared Google Sheet'
type: 'bugfix'
created: '2026-11-12'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `WishesSection` (`Sổ Lưu Bút Chúc Phúc`) currently reads and writes guest wishes exclusively in browser `localStorage` (`wedding_wishes`), so wishes submitted by one visitor are invisible to all other visitors and devices.

**Approach:** Add a shared `wishesService` backed by the existing configured Google Sheet (`googleSheetId`) and Google Apps Script Web App (`scriptUrl`)—working immediately with the currently deployed 2-sheet Apps Script (storing wish rows with `status: 'Sổ lưu bút chúc phúc'` and `count: 0`, filtered out of RSVP counts) and also supporting a dedicated `'Sổ Lưu Bút'` sheet in the Apps Script snippet—while retaining `localStorage` only as an optimistic pending cache and offline fallback.

</frozen-after-approval>

## Implementation Notes

- Created `src/services/wishesService.ts`:
  - Implemented `submitWish` (sanitizes `<`/`>` and lengths, caches optimistically in `wedding_wishes` `localStorage` with `createdAtMs`, broadcasts via `BroadcastChannel` + `CustomEvent` + `storage`, and POSTs `type: 'wish'` with `status: 'Sổ lưu bút chúc phúc'`, `count: 0`, `source: 'Sổ Lưu Bút Chúc Phúc'` to the configured Google Apps Script Web App URL).
  - Implemented `fetchWishesFromGoogleSheet` and `getAllUnifiedWishes` reading Google Sheets `/gviz/tq` JSON with `cache: 'no-store'` and timestamp cache-busting. Because Google Sheets `/gviz/tq` silently falls back to the first sheet (`Xác Nhận Tham Gia`) when a requested sheet (`Sổ Lưu Bút`) does not exist yet, `isRsvpTrackingTable` inspects `table.cols` / first row to parse either the 7-column `Xác Nhận Tham Gia` schema (filtering to wish rows) or a dedicated 4-column `Sổ Lưu Bút` schema, merging both without duplicate fetches when `Sổ Lưu Bút` is absent.
  - `mergeLocalAndRemoteWishes` keeps un-synced optimistic local wishes only for a 5-minute pending TTL (`createdAtMs`) so newly submitted wishes don't flicker while Google Sheets refreshes, while dropping stale pre-fix local-only wishes and honoring host row deletions in Google Sheets.
- Updated `src/services/rsvpService.ts`: extracted `parseRsvpGvizText` and filtered out wish rows (`lưu bút`, `lời chúc`, `sổ lưu bút`) so wishes written to `Xác Nhận Tham Gia` under the existing 2-sheet Apps Script do not inflate RSVP/catering counts.
- Updated `src/components/wishes/WishesSection.tsx` and `src/config/translations.ts`: wired up shared loading/syncing, `visibilitychange` + manual refresh button, submit disabled/confirmation state, `useGuestName()` prefill, and `minmax(min(100%, 300px), 1fr)` grid responsiveness.
- Updated `APPS_SCRIPT_SNIPPET` in `src/components/admin/InviteGeneratorPage.tsx` to support 3 sheets (`Xác Nhận Tham Gia`, `Khách Đã Mở Thiệp`, `Sổ Lưu Bút`) for any future Apps Script redeployment.
- Review patches applied: extracted shared `src/services/gvizUtils.ts` (10s `AbortController` timeout, `Date(...)` formatting, safe `JSON.parse` + status guard), eliminated in-flight fetch/submit race conditions and added `syncSeqRef` in `WishesSection.tsx`, preserved failed offline wishes past TTL, validated non-empty sanitized wishes in `submitWish`, guarded `localStorage` in `getSavedRsvpScriptUrl`/`setSavedRsvpScriptUrl`, surfaced remote load errors and validation/char-limit/accessibility states in `WishesSection.tsx`, hardened `APPS_SCRIPT_SNIPPET` against non-string inputs and Google Sheets formula injection, and added `tests/wishesService.test.mjs` (`npm test`).

## Review Triage Log

- **Finding 1 (In-flight fetch/submit race conditions & missing sequence guard)** — Verdict: `high` (patched). Verified `getAllUnifiedWishes` read `localList` before `await` and `submitWish` wrote back stale `dedupedExisting`; fixed by re-reading `localStorage` after `await` and adding `syncSeqRef` in `WishesSection.tsx`.
- **Finding 2 (False-positive RSVP schema misclassification on `"Sổ Lưu Bút"`)** — Verdict: `high` (patched). Verified `isRsvpTrackingTable` inspected `rows[0]` even when `cols` already carried dedicated guestbook headers; fixed to trust labeled `cols` first.
- **Finding 3 (RSVP parser JSON/schema/cell-formatting gaps)** — Verdict: `medium` (patched). Verified `parseRsvpGvizText` lacked `try/catch`, sheet schema guard against silent sheet-0 fallback, and `c[i]?.f` fallback; fixed via `parseGvizResponseText`, `isNonRsvpSheetTable`, and `getGvizCellText`.
- **Finding 4 (Offline/failed wishes discarded after 5 minutes)** — Verdict: `medium` (patched). Verified `mergeLocalAndRemoteWishes` expired all local items past `PENDING_TTL_MS`; fixed to keep `syncedToGoogleSheet === false` entries indefinitely while expiring posted optimistic entries after 5 minutes.
- **Finding 5 (`submitWish` empty-after-sanitization, `localStorage` `SecurityError`, `no-cors` masking)** — Verdict: `medium` (patched `submitWish` empty check & `try/catch` in `getSavedRsvpScriptUrl`/`setSavedRsvpScriptUrl`; `no-cors` sub-claim is `false`/unavoidable constraint for direct Apps Script Web App `302` redirects without a custom backend proxy).
- **Finding 6 (Silent load/refresh failures, hardcoded validation string, `maxLength`, a11y, `--shadow-card`, `guestName` sync)** — Verdict: `medium` (patched). Verified all items in `WishesSection.tsx` and `src/styles/variables.css`; added `loadFailedNotice`/`validationError`, `maxLength` + counter, `role="alert"`/`aria-live`, `<AlertCircle>` warning icon, `--shadow-paper`, and `guestName` sync.
- **Finding 7 (Missing network timeout, cross-sheet timestamp sort, duplicate-blessing collisions, `Date(...)` formatting)** — Verdict: `medium` (patched). Added 10s `AbortController` timeout, timestamp-aware cross-sheet sorting, `(name, message, createdAt)` table deduplication, `Date(...)` formatting in `gvizUtils.ts`, and UI-language fallback for empty timestamps.
- **Finding 8 (Apps Script type coercion, formula injection, `tryLock`, `scripts/google-apps-script.js` drift & admin UI)** — Verdict: `medium` (patched `APPS_SCRIPT_SNIPPET` with `safeSheetText`, `String(...)` coercion, and `hasLock` guard; deferred pre-existing `scripts/google-apps-script.js` drift from commit `cf5de2b` and admin wish-test UI to `deferred-work.md`).
- **Finding 9 (Missing automated tests)** — Verdict: `medium` (patched). Added `tests/wishesService.test.mjs` and `"test"` script in `package.json`; all 7 unit tests pass.
