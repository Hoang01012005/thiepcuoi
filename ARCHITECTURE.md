# ARCHITECTURE — LUXURY WEDDING INVITATION WEBSITE
## Kiến Trúc Hệ Thống & Giải Pháp Kỹ Thuật (System Architecture)

---

### 1. Kiến trúc tổng thể (High-Level Overview)

Website được xây dựng theo kiến trúc hiện đại **Single-Page Application (SPA)** kết hợp với **Edge Serving & Dynamic SSR Social Injection** thông qua Cloudflare Workers.

```
                  ┌──────────────────────────────────────────────┐
                  │ Khách Mời Truy Cập (Zalo, FB, Browser)       │
                  └──────────────────────┬───────────────────────┘
                                         │ HTTPS Request (?to=...)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │ Cloudflare Edge (Worker: worker.js)          │
                  │ - Content Security Policy (CSP) & Defensive  │
                  │ - Dynamic Open Graph Injection (?to=Tên)     │
                  │ - Static Assets Caching & Single-Page Fallback│
                  └──────────────────────┬───────────────────────┘
                                         │ HTML / CSS / JS / Assets
                                         ▼
        ┌───────────────────────────────────────────────────────────────┐
        │ React 19 Frontend Client (Vite + TypeScript)                  │
        │                                                               │
        │ ├── Core Config (weddingConfig.ts, photos.ts, translations.ts)│
        │ ├── Custom Hooks (useCountdown, useAudio, useGuestName)       │
        │ ├── Design Tokens & Styles (variables.css, index.css)         │
        │ └── Modular UI Components                                     │
        │     ├── EnvelopeCover (3D Wax Seal Opening)                   │
        │     ├── HeroSection & CoupleSection                           │
        │     ├── StoryTimeline & EventDetails                          │
        │     ├── CountdownTimer & WeddingCalendar                      │
        │     ├── GallerySection & LightboxModal                        │
        │     ├── RsvpSection (Offline-First + Sync Engine)             │
        │     ├── WishesSection (Guestbook)                             │
        │     └── GiftSection & ClosingSection                          │
        └───────────────────┬───────────────────────┬───────────────────┘
                            │                       │
                            ▼                       ▼
            ┌──────────────────────────┐  ┌──────────────────────────┐
            │ LocalStorage + Broadcast │  │ Google Apps Script API   │
            │ - Instant Tab Sync       │  │ - Google Sheets Storage  │
            │ - Zero Latency UI        │  │ - Master RSVP Database   │
            └──────────────────────────┘  └──────────────────────────┘
```

---

### 2. Frontend Architecture
- **Framework:** React 19.3 + TypeScript.
- **Bundler:** Vite 8.3 (Hot Module Replacement, tối ưu chunking và minify cực nhanh).
- **Styling Architecture:** 
  - CSS Custom Properties (Design Tokens) tập trung tại `src/styles/variables.css`.
  - Global styles, typography, reset, grid, animation keyframes tại `src/styles/index.css`.
  - Component-scoped inline styles cho các giá trị động kết hợp class ngữ nghĩa.
- **Data Architecture (Configuration-driven):**
  - Mọi dữ liệu về đám cưới nằm tại `src/config/weddingConfig.ts` (Single Source of Truth).
  - Kho tài nguyên hình ảnh định danh tại `src/config/photos.ts`.
  - Dữ liệu đa ngôn ngữ tại `src/config/translations.ts`.
- **State Management:**
  - Local state nhẹ nhàng với React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
  - BroadcastChannel API cho phép đồng bộ trạng thái RSVP giữa nhiều tab/cửa sổ không cần reload.

---

### 3. Backend & Cloudflare Workers Architecture
- **Runtime:** Cloudflare Workers (V8 Isolate).
- **Assets Serving:** Cloudflare Static Assets (`wrangler.json` binding `ASSETS`, `not_found_handling: "single-page-application"`).
- **Dynamic Crawler Handling:**
  - Bắt các tham số URL: `?to=`, `?guest=`, `?name=`, `?khach=`.
  - Sanitize loại bỏ các ký tự nguy hiểm (chống XSS / Header injection).
  - Động hóa thẻ `<title>`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`.
- **Defensive Security Headers:**
  - Content Security Policy (CSP) chặt chẽ, chỉ cho phép tải font từ Google Fonts, ảnh từ Google / VietQR, script nội bộ.
  - X-Frame-Options: DENY (chống Clickjacking).
  - X-Content-Type-Options: nosniff.
  - Strict-Transport-Security: HSTS 1 năm.
  - Referrer-Policy: strict-origin-when-cross-origin.

---

### 4. Dữ liệu & Tích hợp ngoài (Data & External Integrations)
1. **Google Sheets Web App Integration (RSVP):**
   - Khi khách gửi RSVP, dữ liệu lập tức ghi vào `localStorage` của trình duyệt.
   - Gửi yêu cầu ngầm (background fetch với chế độ `no-cors`) tới Google Apps Script Web App để ghi dòng mới vào Google Sheet:
     `https://docs.google.com/spreadsheets/d/18ZRmmnf7wJhgfRVMqxJewOLsps4IPV9J--CqG1lPtLo`
   - Đảm bảo tính khả dụng cao: Nếu mất mạng hoặc Google Apps Script quá tải, dữ liệu vẫn được lưu trữ nguyên vẹn tại client và có nút xuất CSV dự phòng.
2. **VietQR API / QR Banking:**
   - Sử dụng định dạng QR chuẩn Napas247 từ `img.vietqr.io` và ảnh QR nội bộ trong `public/assets/photos/qr-groom.png` và `qr-bride.png`.
3. **Google Maps Integration:**
   - Đường dẫn liên kết trực tiếp tới tọa độ chuẩn xác của tư gia.

