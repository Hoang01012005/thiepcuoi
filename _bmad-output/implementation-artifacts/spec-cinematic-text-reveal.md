---
title: 'Premium Wedding Invitation Cinematic Text Reveal'
type: 'feature'
created: '2026-11-07'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '78b35b278ac1f8eb2e084cd4842d5471a552258d'
context: ['d:/Downloads/New folder/PRD.md', 'd:/Downloads/New folder/_bmad-output/planning-artifacts/ux-designs/ux-nam-hiep-wedding/DESIGN.md', 'd:/Downloads/New folder/_bmad-output/planning-artifacts/ux-designs/ux-nam-hiep-wedding/EXPERIENCE.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The current invitation uses shared fade-up reveals, but the opening hero still presents its text groups simultaneously and does not feel like a physical wedding card being written and uncovered. The same editorial language should carry through the invitation without changing its content or layout.

**Approach:** Add a reusable cinematic text-reveal contract based on opacity, clip-path/mask-like clipping, transform, and the existing IntersectionObserver. Apply it to the hero's existing mobile and desktop groups in a deliberate opening sequence, use the same language for section headings, paragraphs, event details, and existing names, and use a left-to-right clip reveal for names because the current names are normal text rather than SVG paths.

## Boundaries & Constraints

**Always:** Preserve all existing copy, images, colors, fonts, responsive layout, envelope flow, fixed bottom navigation, and data. Use `cubic-bezier(0.22, 1, 0.36, 1)`, 1000–1800ms group durations, 250–400ms group spacing where practical, opacity plus transform and clip-path, GPU-friendly properties, one-shot viewport activation, and `prefers-reduced-motion`. Keep Vietnamese text as intact DOM text so diacritics never split from words.

**Never:** Do not add missing wedding content, SVG handwriting paths, typewriter-per-character animation, bounce/elastic/strong zoom, layout-affecting animation, heavy animation libraries, or changes to the bottom navigation and envelope timing contract.

</frozen-after-approval>

## Code Map

- `src/components/hero/HeroSection.tsx` -- renders separate mobile and desktop hero markup with currently forced `reveal-init is-revealed` groups; apply semantic cinematic classes and ordered delays to existing logo, invitation, couple names, date/location, decoration, and actions.
- `src/components/common/SectionHeading.tsx` -- shared section heading, divider, and subtitle markup; retain the existing heading clip and add the shared text-group semantics without changing copy.
- `src/components/events/EventDetails.tsx` -- ceremony and banquet card content already has ordered stage classes; align their timing and address/metadata text with the cinematic group contract.
- `src/styles/index.css` -- owns reveal utilities, stagger timing, heading clipping, event-card stages, reduced-motion rules, and the new left-to-right text mask/clip utilities.
- `src/hooks/useScrollReveal.ts` -- owns one-shot viewport activation and hero/envelope gating; reuse the observer and do not trigger every section at initial load.
- `src/components/envelope/EnvelopeCover.tsx` -- owns the physical envelope handoff; preserve its open/skip timers and only rely on the hero reveal after `onOpen`.

## Tasks & Acceptance

**Execution:**
- [x] `src/styles/index.css` -- add cinematic group, clip-text, handwriting-like name, decorative fade, and reduced-motion rules using opacity, transform, and clip-path only.
- [x] `src/components/hero/HeroSection.tsx` -- replace forced generic hero reveal classes with ordered cinematic classes for both responsive hero variants, keeping all existing content and layout.
- [x] `src/components/common/SectionHeading.tsx` -- apply the shared cinematic heading/paragraph reveal semantics to section headings.
- [x] `src/components/events/EventDetails.tsx` -- align event-card label, title, time, place, address, lunar note, and actions with 250–400ms group spacing.
- [x] `src/hooks/useScrollReveal.ts` and `src/components/envelope/EnvelopeCover.tsx` -- verify observer gating and envelope handoff remain unchanged; edit only if required for the new classes.

**Acceptance Criteria:**
- Given the guest opens the envelope, when the hero becomes visible, then existing hero groups appear in order: visual decoration/logo, invitation metadata, guest/family-facing details already present, invitation prefix, groom name, ampersand, bride name, and final date/location/actions, with no group appearing all at once.
- Given the hero names use normal text, when their reveal runs, then each name uses a continuous left-to-right clip/mask plus opacity and a gentle upward motion; no per-character typing or fake SVG stroke is used.
- Given a section heading or paragraph enters the viewport, when its observer trigger fires, then the text reveals from below or left-to-right with 1000–1800ms group timing, 250–400ms stagger spacing, and no layout shift.
- Given either wedding event card enters the viewport, when its staged reveal runs, then label, title, time, location, address, lunar note, and actions appear in reading order with restrained spacing and unchanged copy.
- Given the user scrolls away and back, when an already revealed element re-enters, then its animation does not replay.
- Given `prefers-reduced-motion: reduce`, when the invitation opens or sections enter view, then all text is immediately visible with no transform, clip, or transition.
- Given the site is tested at desktop and 390px mobile widths, when the page is opened and scrolled, then text remains readable, diacritics remain intact, no content is clipped, no horizontal overflow occurs, and the fixed bottom navigation remains usable.

## Implementation Notes

The prior reveal commit is the baseline. `_update_slow.py` is an existing untracked legacy script and must remain outside this feature; do not execute or modify it. The available hero copy does not include separate visible family/address blocks, so map the requested sequence to the existing hero groups rather than adding new content. Validate with build, lint, direct desktop/mobile browser checks, and reduced-motion CSS inspection.

## Design Notes

Use one reusable CSS language across the invitation: a soft vertical lift for section titles, a left-to-right clipping veil for names and text groups, and long enough transitions to feel like ink settling on paper. Keep content in normal DOM flow; clipping should affect only paint, never dimensions.

## Verification

**Commands:**
- `npm run build` -- expected: TypeScript and Vite production build succeeds.
- `npm run lint` -- expected: no new errors; pre-existing warnings may remain.
- `git diff --check` -- expected: no whitespace errors.

**Manual checks:**
- Open the invitation at desktop and 390px mobile, open or skip the envelope, and confirm the hero sequence is visibly staged without layout shift.
- Scroll through headings, event cards, and text sections and confirm one-shot reveal, readable Vietnamese diacritics, no horizontal clipping, and usable fixed bottom navigation.
- Inspect reduced-motion rules and confirm reveal classes become immediately visible.

Implementation completed in `src/styles/index.css`, `src/components/hero/HeroSection.tsx`, `src/components/common/SectionHeading.tsx`, and `src/hooks/useScrollReveal.ts`. The section-heading parent remains on the existing observer contract while cinematic clipping is applied to its children; this avoids leaving headings hidden outside the hero. Build, lint, whitespace, desktop, mobile, and reduced-motion checks passed. `_update_slow.py` was not modified.

## Review Triage Log

- false — EventDetails was not changed in this pass because its existing staged markup already satisfied the required event sequence; the new CSS timing and clip-path rules apply to those existing stages, and browser checks confirmed both cards reveal.
- false — The hero gate remains controlled by `useGlobalScrollReveal(isEnvelopeOpened)` in `App.tsx`; the hook only runs its observer after envelope handoff or skip, and browser checks confirmed the hero becomes visible after both paths.
- false — Envelope behavior was intentionally preserved; no EnvelopeCover change was needed, and the direct open/skip browser check confirmed the handoff.
- false — Browser verification was performed at 390px and desktop widths, including normal-motion sequence inspection and reduced-motion computed-style checks.
- false — The current review spec status is `in-review`, while task completion is recorded for the implementation stage; the final workflow will transition it to `done` after presentation.
- false — The source spec is UTF-8 and reads correctly in the editor; mojibake appeared only in the PowerShell-generated diff rendering, not in the checked source content.
- false — Existing EventDetails stage classes cover label, title, time, venue, address, lunar note, and actions; the CSS timing change is sufficient without duplicating markup changes.
- false — No executable UI test harness exists in this repository; direct Playwright browser checks covered hero open/skip, section heading visibility, event stages, mobile layout, and reduced motion.
