# PROJECT BRIEF — LUXURY WEDDING INVITATION WEBSITE
## Dự án: Redesign Website Thiệp Cưới Đẳng Cấp Cho Hoàng Nam & Ngọc Hiệp

---

### 1. Tổng quan dự án (Project Overview)
- **Tên dự án:** Luxury Romantic Wedding Invitation Website
- **Repository:** `https://github.com/Hoang01012005/thiepcuoi`
- **Chủ rể & Cô dâu:** Nguyễn Văn Nam (Hoàng Nam) & Đoàn Thị Hiệp (Ngọc Hiệp)
- **Ngày cưới trọng đại:** 
  - Tiệc cưới chung vui: 15:00 Thứ Bảy, 28/11/2026 (Tư gia nhà gái)
  - Lễ vu quy & thành hôn: 09:00 Chủ Nhật, 29/11/2026 (Tư gia nhà gái & nhà trai)
- **Địa điểm:**
  - Nhà Gái: Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội
  - Nhà Trai: Số 22, ngõ 11, Bảo Lộc 2, Phúc Lộc, Hà Nội
- **Mục tiêu:** Tái thiết kế toàn diện (Redesign) website thiệp cưới theo phong cách **Luxury Romantic Wedding**, kết hợp phong cách **Editorial Wedding**, **Minimalist Premium** và nét tinh tế của **Korean Wedding Aesthetic**, đồng thời tối ưu hoàn hảo cho trải nghiệm trên mọi thiết bị di động (Mobile-First).

---

### 2. Định hướng phong cách & Design System
- **Tone & Mood:** Trang trọng, lãng mạn, ấm cúng, sang trọng, tinh khôi.
- **Bảng màu chủ đạo (Signature Luxury Palette):**
  - **Ivory (Ngà tinh khôi - Nền chính):** `#FAF7F0`
  - **Champagne Gold (Vàng Champagne - Điểm nhấn viền & kim loại):** `#C6A46A`
  - **Dusty Rose (Hồng tro lãng mạn - Điểm nhấn phụ & nút bấm):** `#C99A9A`
  - **Warm Beige (Beige ấm - Thẻ nội dung & nền phụ):** `#E8DFD2`
  - **Deep Brown (Nâu hạt dẻ trầm - Typography & chữ hiển thị):** `#40352F`
- **Hệ thống Font chữ (Typography System):**
  - **Tiêu đề & Monogram:** `Playfair Display` (Serif cổ điển, thanh lịch)
  - **Tiêu đề phụ / Trích dẫn / Cổ điển:** `Cormorant Garamond` (Serif tinh tế, trang nhã)
  - **Nội dung / Mobile UI:** `Be Vietnam Pro` (Sans-serif hiện đại, tối ưu hiển thị tiếng Việt hoàn hảo trên màn hình nhỏ)

---

### 3. Danh sách các tính năng cốt lõi (Core Features)
1. **Interactive Envelope Cover (Mở phong bì thiệp cưới tương tác):**
   - Thiết kế phong bì dập sáp hoàng gia (Wax Seal N&H), mở nắp 3D mượt mà.
   - Cá nhân hóa tên khách mời từ tham số URL (`?to=...`, `?guest=...`).
   - Tự động kích hoạt phát nhạc nền lãng mạn sau tương tác mở hoặc chạm đầu tiên.
2. **Editorial Wedding Hero:**
   - Ảnh chân dung chính thức dạng cổng vòm (Arch) với hiệu ứng hào quang champagne vàng.
   - Thông tin cô dâu, chú rể, ngày cưới âm/dương lịch và nút CTA dẫn đến RSVP & Lịch trình.
3. **Couple Monogram & Profiles:**
   - Giới thiệu song thân phụ mẫu và quê hương hai bên gia đình.
4. **Love Story Timeline (Câu chuyện tình yêu):**
   - 4 dấu mốc từ ngày gặp gỡ, bước chung đôi, lời cầu hôn đến ngày chung bước.
   - Trượt mượt dạng carousel chạm (Mobile-friendly) hoặc timeline vertical.
5. **Interactive Wedding Schedule (Lịch trình & Bản đồ):**
   - Chi tiết thời gian, địa điểm Lễ Thành Hôn và Tiệc Cưới.
   - Nút dẫn đường Google Maps chính xác.
   - Nút thêm vào lịch điện tử (Google Calendar / Apple iCal / Outlook).
6. **Live Countdown Timer (Đồng hồ đếm ngược):**
   - Đếm ngược chính xác đến ngày cưới `2026-11-29T09:00:00+07:00`.
   - Lịch tháng 11/2026 đánh dấu trái tim ngày trọng đại.
7. **Curated Photo Gallery & Lightbox:**
   - 10 ảnh cưới nghệ thuật (Studio Cổ Điển, Sân Vườn Lãng Mạn, Cổ Phục Truyền Thống).
   - Bộ lọc theo album và Lightbox phóng to ảnh, vuốt chuyển ảnh mượt trên điện thoại.
8. **RSVP Trực Tuyến (Xác nhận tham dự):**
   - Form gửi xác nhận tham dự với số lượng người và số điện thoại.
   - Đồng bộ thời gian thực qua LocalStorage + Google Sheets (Web App API).
   - Tự động điền tên khách mời từ URL.
9. **Guestbook / Wishes (Sổ lưu bút & Lời chúc):**
   - Khách mời gửi lời chúc phúc ý nghĩa đến cô dâu và chú rể.
   - Hiển thị danh sách lời chúc trang trọng.
10. **Hộp mừng cưới (Gift Section):**
    - Thông tin tài khoản ngân hàng và mã VietQR cho cả nhà trai và nhà gái.
    - Chức năng sao chép số tài khoản nhanh 1 chạm.
11. **Music Player & Background Audio:**
    - Phát bài hát lễ cưới lãng mạn ("Cưới Đi"), có nút điều khiển bật/tắt tiện lợi, visualizer sóng âm thanh.

---

### 4. Nguyên tắc bảo vệ dự án (Non-Negotiable Constraints)
1. **Tuyệt đối bảo toàn dữ liệu thật:** Tên cô dâu, chú rể, phụ mẫu, ngày cưới, địa điểm, câu chuyện tình yêu, số tài khoản ngân hàng, mã QR, link Google Sheets.
2. **Không làm hỏng API & Cloudflare Worker:** Giữ vững xử lý bảo mật CSP, HSTS, dynamic Open Graph metadata cho khách mời cá nhân hóa.
3. **Mobile-First Responsive:** Hoạt động không tì vết từ 320px, 375px, 390px đến màn hình máy tính bảng và desktop lớn.
4. **Không lỗi Build & Không lỗi Console.**
