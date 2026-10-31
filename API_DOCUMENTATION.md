# API DOCUMENTATION — LUXURY WEDDING INVITATION WEBSITE
## Tài Liệu Tích Hợp API & Cloudflare Worker (Backend Specifications)

---

### 1. Cloudflare Worker Edge Service (`worker.js`)

#### 1.1. Dynamic Open Graph & Crawlers Injection
- **Mục đích:** Khi người dùng gửi link thiệp mời cá nhân hóa (VD: `https://thiepcuoi.pages.dev/?to=Gia đình Bác Hùng`), hệ thống Cloudflare Worker sẽ bắt URL, giải mã tham số `to`, lọc bỏ ký tự nguy hiểm (anti-XSS), và tự động chèn các thẻ meta Open Graph trực tiếp vào HTML response trước khi trả về cho crawler của Zalo, Facebook Messenger, Telegram, iMessage.
- **Tham số hỗ trợ:** `to`, `guest`, `name`, `khach`.
- **Ví dụ Snippet Output:**
  ```html
  <title>Thiệp Mời: Gia đình Bác Hùng — Hoàng Nam &amp; Ngọc Hiệp</title>
  <meta property="og:title" content="Thiệp Mời: Gia đình Bác Hùng — Hoàng Nam &amp; Ngọc Hiệp" />
  <meta property="og:description" content="Trân trọng kính mời Gia đình Bác Hùng tới tham dự lễ cưới của Hoàng Nam &amp; Ngọc Hiệp vào ngày 28 &amp; 29 tháng 11 năm 2026." />
  <meta property="og:image" content="https://thiepcuoi.pages.dev/assets/photos/hero.jpg?v=20261021" />
  ```

#### 1.2. Defensive Security Headers
- **Content-Security-Policy (CSP):**
  - `default-src 'self';`
  - `script-src 'self' 'unsafe-inline';`
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;`
  - `font-src 'self' https://fonts.gstatic.com data:;`
  - `img-src 'self' data: blob: https://docs.google.com https://*.google.com https://*.googleusercontent.com https://img.vietqr.io;`
  - `media-src 'self' blob: data:;`
  - `connect-src 'self' https://docs.google.com https://script.google.com https://script.googleusercontent.com https://img.vietqr.io;`
  - `frame-ancestors 'none';`
- **X-Frame-Options:** `DENY` (Ngăn chặn iframe nhúng trái phép).
- **X-Content-Type-Options:** `nosniff`.
- **Strict-Transport-Security (HSTS):** `max-age=31536000; includeSubDomains; preload`.

---

### 2. Google Apps Script Web App Integration (RSVP Endpoint)

- **Phương thức:** `POST`
- **Chế độ:** `no-cors` (Tránh preflight CORS block trên môi trường browser).
- **Mẫu Payload JSON:**
  ```json
  {
    "timestamp": "28/11/2026 15:30:00",
    "name": "Nguyễn Văn A",
    "status": "Chắc chắn tham dự",
    "count": 2,
    "phone": "0912345678",
    "message": "Chúc hai bạn trăm năm hạnh phúc!",
    "source": "Thiệp cưới online Hoàng Nam & Ngọc Hiệp",
    "sheetId": "18ZRmmnf7wJhgfRVMqxJewOLsps4IPV9J--CqG1lPtLo"
  }
  ```
- **Xử lý phía Client:**
  - Ngay khi người dùng nhấn "Gửi xác nhận", dữ liệu lập tức ghi vào `localStorage` (`wedding_rsvps`).
  - Gửi sự kiện Broadcast qua `BroadcastChannel('wedding_rsvps_sync_bus')` để toàn bộ các tab trình duyệt đang mở cập nhật tức thì.
  - Gửi ngầm tới Google Apps Script URL. Nếu không có kết nối internet hoặc URL chưa cấu hình, dữ liệu vẫn an toàn tuyệt đối trên máy người dùng.

---

### 3. Google Visualization Query API (Đọc danh sách RSVP)

- **Endpoint:** `https://docs.google.com/spreadsheets/d/{sheetId}/gviz/tq?tqx=out:json`
- **Mục đích:** Đồng bộ danh sách khách mời đã phản hồi về trang quản trị nội bộ hoặc thống kê.
- **Xử lý:** Parse JSON dạng Google Visualization table, loại bỏ các dòng tiêu đề trùng lặp, lọc số điện thoại và chuyển đổi thành đối tượng `RsvpSubmission`.
