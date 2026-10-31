# PERFORMANCE & CORE WEB VITALS REPORT (Agent 6)

## 1. Executive Summary
- **Role:** Agent 6 — Performance / SEO / Deployment Engineer
- **Project:** Luxury Romantic Wedding Invitation Website
- **Evaluation Target:** Production build artifact (`dist/`)
- **Key Metrics Highlight:**
  - Build Duration: **357 ms**
  - Production Bundle JS (gzipped): **120.96 kB**
  - Production Bundle CSS (gzipped): **3.74 kB**
  - HTML (gzipped): **0.88 kB**
  - Zero heavy 3rd-party tracking scripts (No GA, GTM, FB Pixel blocking the main thread)

---

## 2. Core Web Vitals Optimization Architecture

### Largest Contentful Paint (LCP)
- **Target:** < 2.5s on mobile 4G / 3G connections.
- **Implementation:**
  - Hero image uses WebP with JPG fallback, preloaded with high priority.
  - Next-gen image format (`.webp`) reduces payload by 45–65% compared to raw photos.
  - Critical font weights (`Be Vietnam Pro` 400/600 and `Cormorant Garamond` 600) preconnected to Google Fonts CDN (`fonts.googleapis.com` & `fonts.gstatic.com`).

### Interaction to Next Paint (INP)
- **Target:** < 200ms for touch interactions.
- **Implementation:**
  - Wax seal tap triggers CSS-accelerated hardware transforms (`transform: scale()`, `opacity`).
  - Form state updates are decoupled from DOM paint operations using React 19 synthetic events.
  - Magnetic button hover effect is dynamically disabled on touch devices to conserve CPU cycles.

### Cumulative Layout Shift (CLS)
- **Target:** < 0.1 (Optimal score: 0.00).
- **Implementation:**
  - All image containers have explicit aspect ratio declarations (`aspect-ratio: 4/5`, `aspect-ratio: 2/3`, `aspect-ratio: 16/9`).
  - Skeleton / placeholder backgrounds prevent layout jumping during image loading.
  - Sticky navbar has fixed height reserve (`0.75rem` padding + standard icon heights).

---

## 3. Asset Loading & Caching Strategy
- **Static Assets:** Cached immutably (`Cache-Control: public, max-age=31536000, immutable`) via Vite content-hashing (`index-DjZdCG_h.css`, `index-DHE2_-jh.js`).
- **Dynamic HTML:** Handled via Cloudflare Worker with `no-cache` / `must-revalidate` to ensure real-time query parameter parsing (`?to=...`) without stale preview issues.
- **Audio Loading:** Preload set to `metadata` to avoid wasting cellular bandwidth on initial page download before user intent.
