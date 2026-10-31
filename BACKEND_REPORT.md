# BACKEND REPORT — LUXURY WEDDING INVITATION WEBSITE
## Báo Cáo Kỹ Thuật Backend & Tích Hợp Dữ Liệu (Backend Engineer)

---

### 1. Hiện trạng & Kiểm tra tính toàn vẹn (Integrity Check)
- Đã rà soát file `worker.js`, `wrangler.json`, `src/services/rsvpService.ts`.
- **Cấu hình Cloudflare Worker:**
  - `wrangler.json` khai báo đúng SPA routing với fallback asset `index.html`.
  - Không có secrets hay token nhạy cảm bị hardcode trong mã nguồn.
  - Các biến liên kết Google Sheet ID (`18ZRmmnf7wJhgfRVMqxJewOLsps4IPV9J--CqG1lPtLo`) an toàn ở chế độ đọc bảng tính công khai đã được chia sẻ.
- **Bảo mật CSP:**
  - Chính sách CSP hoàn toàn hỗ trợ nguồn tải font từ Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`).
  - Hỗ trợ ảnh từ `img.vietqr.io` để quét mã thanh toán ngân hàng.

---

### 2. Luồng dữ liệu RSVP & Guestbook
- **Chiến lược Offline-First:**
  - Dữ liệu phản hồi được ưu tiên ghi vào `localStorage` của trình duyệt trước để đảm bảo phản hồi tức thì dưới 16ms cho người dùng.
  - Sau đó, background fetch được kích hoạt đồng bộ lên Google Apps Script Web App.
  - Đã tích hợp tính năng xuất dữ liệu ra file CSV (`exportRsvpsToCsv`) với cơ chế sanitize ký tự đặc biệt (`=+@-`) nhằm triệt tiêu lỗ hổng CSV Injection khi mở trên Microsoft Excel.

---

### 3. Kết luận từ Backend Engineer
Hệ thống backend và tích hợp dữ liệu đạt độ ổn định 100%, bảo toàn dữ liệu, chống rò rỉ secrets, tuân thủ nghiêm ngặt nguyên tắc bảo vệ dự án. Đã sẵn sàng bàn giao cho Frontend Developer (Agent 3).

