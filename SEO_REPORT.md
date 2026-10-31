# SEO & SOCIAL SHARING REPORT (Agent 6)

## 1. Overview
The Wedding Invitation website is optimized for both search discovery and rich personalized sharing across social chat platforms: Zalo, Facebook Messenger, Telegram, iMessage, and Viber.

---

## 2. Meta Tags & Open Graph Specifications

### Static Fallback Tags (`index.html`)
- `title`: Hoàng Nam & Ngọc Hiệp — Thiệp Cưới | Wedding Invitation
- `description`: Trân trọng kính mời quý khách tham dự lễ thành hôn của Hoàng Nam & Ngọc Hiệp. Warmly invite you to celebrate the wedding of Hoang Nam & Ngoc Hiep.
- `og:type`: `website`
- `og:image`: `/assets/photos/hero.jpg?v=20261021` (Optimal 1200x630px social card dimension)
- `theme-color`: `#FAF7F0` (Ivory matching luxury wedding aesthetic)
- `robots`: `index, follow`

### Dynamic Social Previews via Cloudflare Worker (`worker.js`)
When bride and groom distribute personalized wedding links, the Cloudflare Worker intercepts the request and injects dynamic Open Graph tags:

- **Link format:** `https://thiepcuoi.pages.dev/?to=Gia%20%C4%91%C3%ACnh%20b%C3%A1c%20So%C3%A1i`
- **Dynamic Title rendered on Zalo/Messenger/FB:**
  `Thiệp Mời: Gia đình bác Soái — Hoàng Nam & Ngọc Hiệp`
- **Dynamic Description rendered:**
  `Trân trọng kính mời Gia đình bác Soái tham dự lễ thành hôn của chúng tôi vào ngày 28 & 29 tháng 11 năm 2026.`
- **Sanitization:** Strict filtering of special characters and HTML tags prevents injection in preview cards.

---

## 3. Structured Data (JSON-LD)
The application embeds wedding event structured data so search engines recognize date, location, and couple names:
- `@type`: `Event` / `SocialEvent`
- `name`: Lễ Thành Hôn Hoàng Nam & Ngọc Hiệp
- `startDate`: `2026-11-28T15:00:00+07:00`
- `endDate`: `2026-11-29T12:00:00+07:00`
- `eventAttendanceMode`: `https://schema.org/OfflineEventAttendanceMode`
- `location`:
  - Nhà Gái: Số 11 Bảo Lộc 2, Phúc Lộc, Hà Nội
  - Nhà Trai: Số 22 ngõ 11 Bảo Lộc 2, Phúc Lộc, Hà Nội

---

## 4. Crawlability & Indexing Verification
- [x] `sitemap.xml` ready for deployment root.
- [x] `robots.txt` configured to allow all search crawlers.
- [x] Valid canonical URL structure avoiding duplicate parameter loops.
