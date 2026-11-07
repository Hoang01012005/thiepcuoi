---
title: 'Luxury Typography Reveal Animations'
type: 'feature'
created: '2026-11-07'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
baseline_commit: '8b414661282a24689d15a8e8311fe7f9ba0c211d'
context: ['d:/Downloads/New folder/PRD.md', 'd:/Downloads/New folder/_bmad-output/planning-artifacts/ux-designs/ux-nam-hiep-wedding/DESIGN.md', 'd:/Downloads/New folder/_bmad-output/planning-artifacts/ux-designs/ux-nam-hiep-wedding/EXPERIENCE.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The wedding invitation already has a global scroll reveal, but text and event-card content do not yet follow a consistent luxury editorial sequence. The current effect also uses a different easing and longer motion profile than the requested reveal language.

**Approach:** Upgrade the shared reveal contract with a smooth fade-up typography treatment, heading clip reveals, controlled line/content staggering, and a staged reveal sequence inside the two wedding event cards. Keep the existing visual identity, copy, layout, envelope gating, and mobile navigation unchanged.

**Boundaries & Constraints**

**Always:** Use CSS opacity and transform transitions plus the existing IntersectionObserver engine; trigger each element once; preserve layout dimensions; support `prefers-reduced-motion`; keep timing subtle and readable on mobile and desktop; preserve all existing colors, fonts, text, responsive layout, and interaction behavior.

**Never:** Do not change wedding copy, data, font or color tokens, card layout, fixed bottom navigation, envelope flow, or add a heavy animation dependency. Do not animate individual characters or use bounce, aggressive zoom, or layout-affecting properties.

</frozen-after-approval>

## Code Map

- `src/styles/index.css` -- owns `.reveal-init`, `.reveal-soft`, stagger delays, heading clip utilities, event-card stage utilities, and reduced-motion rules. Preserve the existing uncommitted slow-motion intent while aligning easing and distances.
- `src/hooks/useScrollReveal.ts` -- owns the global one-shot IntersectionObserver and envelope/hero gating. Reuse its observer contract; do not make all animation run on initial load.
- `src/components/common/SectionHeading.tsx` -- provides the shared badge, heading, divider, and subtitle markup. Add only reusable semantic classes needed for heading/paragraph reveal.
- `src/components/events/EventDetails.tsx` -- owns the ceremony and banquet card markup. Add stage classes to existing elements in the required order without changing text, data, layout, or actions.
- `package.json` -- confirms the existing build/lint commands and that no animation package is needed.

## Tasks & Acceptance

**Execution:**
- [x] `src/styles/index.css` -- implement the shared fade-up, heading clip, paragraph, stagger, event-card stage, and reduced-motion rules using opacity/transform and the requested easing.
- [x] `src/components/common/SectionHeading.tsx` -- apply the heading/paragraph reveal classes while preserving the existing markup content and design tokens.
- [x] `src/components/events/EventDetails.tsx` -- stage both wedding event cards from border and label through title, metadata, address, lunar note, and actions with restrained delays.
- [x] `src/hooks/useScrollReveal.ts` -- confirm the existing one-shot viewport activation and envelope gating remain sufficient without changes.

**Acceptance Criteria:**
- Given a normal-motion user scrolls a section into view, when its content intersects the viewport, then the content fades from opacity 0 and translates upward no more than 30px using `cubic-bezier(0.22, 1, 0.36, 1)` and completes within the requested editorial timing range.
- Given a section heading enters the viewport, when its parent is revealed, then the badge, clipped title, divider, and subtitle appear in sequence with line/content delays of approximately 120–180ms and the paragraph follows the heading by approximately 200–300ms.
- Given either wedding event card enters the viewport, when its reveal runs, then its border, part label, title, time/location metadata, content, address, lunar note, and actions appear in that order without bounce, aggressive zoom, layout shift, or changed copy.
- Given a user scrolls back over an already revealed component, when it re-enters the viewport, then its reveal does not replay.
- Given `prefers-reduced-motion: reduce`, when the page loads or content enters view, then all reveal content is immediately visible with no transition, blur, or transform.
- Given the site is built, when `npm run build` and `npm run lint` run, then both complete without new TypeScript, CSS, or lint errors.

## Implementation Notes

The working tree already contains an uncommitted slow-reveal adjustment in `src/styles/index.css` and `_update_slow.py`. Keep those changes intact unless the requested behavior requires replacing the same declarations; do not revert unrelated work. Validate desktop and mobile behavior through the running site after implementation, with special attention to event-card content visibility and fixed bottom navigation.

Implementation completed in `src/styles/index.css`, `src/components/common/SectionHeading.tsx`, and `src/components/events/EventDetails.tsx`. The global observer required no change. Build and lint pass; lint retains only pre-existing warnings. Desktop and mobile browser checks confirmed revealed headings/cards, complete address and actions, no horizontal overflow, and fixed bottom navigation visibility.

Implementation completed with the existing one-shot `useGlobalScrollReveal` observer. Updated the shared reveal contract to use `cubic-bezier(0.22, 1, 0.36, 1)`, opacity/transform-only motion, sub-30px offsets, heading clipping, editorial delays, ordered event-card stages, and immediate reduced-motion visibility. No copy, data, layout, navigation, envelope flow, or dependencies changed.

Verification: `npm run build` passed, `npm run lint` passed with existing warnings outside the touched files, and the Vite dev server returned HTTP 200 for the application shell. The temporary dev server was stopped after the smoke check.

## Review Triage Log

- low — false: the heading-to-subtitle delay is 0.52s - 0.28s = 0.24s, within the requested 200–300ms range.
- low — false: the event card's outer reveal exposes its border before the staged label and content, so the requested visual order is preserved.
- low — patch: `.reveal-scale` used the shared transition variables without receiving their declarations; the variables are now shared with that utility.
- low — false: browser verification covered the rendered section headings and both event cards in normal motion at desktop and mobile sizes; this repository has no executable UI test harness to add without expanding scope.
- defer — `_update_slow.py` is pre-existing untracked tooling that can overwrite the new reveal CSS if executed; it is outside this story and remains unchanged.
