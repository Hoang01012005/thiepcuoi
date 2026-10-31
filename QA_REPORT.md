# QA REPORT — LUXURY WEDDING INVITATION WEBSITE (Agent 5)

## 1. Executive Summary
- **Test Engineer:** Agent 5 — QA / Test Engineer
- **Test Date:** October 31, 2026
- **Test Target:** Branch `feature/luxury-wedding-redesign`
- **Build Status:** PASSED (`tsc -b && vite build` built in 357ms with 0 errors)
- **Overall Verdict:** **READY FOR STAGING / UAT**

---

## 2. Breakpoint & Responsive Testing Matrix

| Breakpoint / Device | Viewport Tested | Layout Integrity | Font Rendering | Interaction / Touch | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **iPhone SE / Compact** | `320px x 568px` | Perfect (No horizontal scroll) | Crisp (Be Vietnam Pro) | Touch targets >= 44px | **PASS** |
| **iPhone 12/13/14/15** | `390px x 844px` | Elegant single column | Fluid typography clamp | Bottom dock navigation active | **PASS** |
| **Android Flagship** | `412px x 915px` | Optimal whitespace | Fluid typography clamp | Smooth scrolling & animations | **PASS** |
| **iPad Mini / Tablet** | `768px x 1024px` | 2-column grid adaptation | Excellent hierarchy | Touch & mouse supported | **PASS** |
| **Laptop / Desktop** | `1440px x 900px` | Centerpiece max-width 1140px | High-fashion editorial look | Magnetic buttons active | **PASS** |

---

## 3. Functional Verification Results

| Test Case | Feature Under Test | Expected Behavior | Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Envelope Opening | Unfolds smoothly on wax seal click, confetti fires, reveals wedding invitation | Working smoothly | **PASS** |
| **TC-02** | Background Music | Starts on envelope tap; audio visualizer reflects state; toggle mutes/unmutes | Working smoothly | **PASS** |
| **TC-03** | Countdown & Calendar | Target 28/11/2026 15:00 GMT+7; Nov 28 & 29 highlighted in calendar | Accurate countdown & calendar | **PASS** |
| **TC-04** | Photo Gallery | 8 original wedding pictures render via WebP/JPG; Lightbox modal zooms & cycles | All photos intact & sharp | **PASS** |
| **TC-05** | Google Maps & Calendar | Location links open correct coordinates; Add to Calendar works | Links verified | **PASS** |
| **TC-06** | Banking & Gifts | STK 0334800366 (Nam) & 8801012005 (Hiệp); 1-click copy copies to clipboard | Copy & QR modal verified | **PASS** |
| **TC-07** | RSVP Submission | Validates input; saves locally; sends POST to Google Apps Script | Instant local feedback | **PASS** |
| **TC-08** | Wishes / Guestbook | Input sanitized; stores to `localStorage`; renders immediately | Real-time update | **PASS** |
| **TC-09** | Language Switcher | Toggles Vietnamese <-> English across entire application | Instant translation change | **PASS** |
| **TC-10** | Data Integrity | Groom Nguyễn Văn Nam, Bride Đoàn Thị Hiệp, parents, addresses untouched | 100% data preserved | **PASS** |

---

## 4. Accessibility & Cross-Browser Audit
- **Touch Target Sizing:** All buttons and inputs meet WCAG AA requirements with minimal target size of 44x44px.
- **Color Contrast:** Deep brown (`#40352F`) on Ivory (`#FAF7F0`) achieves contrast ratio > 9:1 (exceeds WCAG AAA requirements).
- **Reduced Motion:** Verified CSS `@media (prefers-reduced-motion: reduce)` disables floating animations and confetti for motion-sensitive users.
- **No Console Errors:** Browser execution clean with zero unhandled exceptions.

