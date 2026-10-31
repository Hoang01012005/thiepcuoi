# COMPONENT SPECIFICATIONS
## LUXURY WEDDING INVITATION WEBSITE — COMPONENT ARCHITECTURE & INTERFACE CONTRACTS

---

### 1. `EnvelopeCover.tsx`
- **Mục đích:** Trải nghiệm mở thiệp tương tác ban đầu.
- **Props Interface:**
  ```typescript
  interface EnvelopeCoverProps {
    lang: 'vi' | 'en';
    onStartOpen?: () => void;
    onOpen: () => void;
  }
  ```
- **Hành vi:**
  - Trạng thái: `closed` -> `opening` -> `revealing`.
  - Con dấu sáp dập nổi chữ lồng `N & H` màu vàng Champagne Gold (`#C6A46A`).
  - Nắp trên phong bì mở 3D (`transform: rotateX(-180deg)`).
  - Tấm thiệp bên trong nâng lên nhẹ nhàng.
  - Pháo hoa giấy kim tuyến champagne bung nở.
  - Tự động kích hoạt phát nhạc nền lãng mạn.
  - Nút "Bỏ qua" góc trên bên phải cho phép vào trang chính ngay lập tức.

---

### 2. `HeroSection.tsx`
- **Mục đích:** Trung tâm thị giác đầu tiên của thiệp cưới.
- **Props Interface:**
  ```typescript
  interface HeroSectionProps {
    lang: 'vi' | 'en';
  }
  ```
- **Hành vi:**
  - Khung ảnh chân dung dáng vòm hoàng gia (Arch frame) với ảnh chính của Nam & Hiệp.
  - Tên đôi uyên ương hiển thị lớn, sắc nét với font `Playfair Display`.
  - Thông điệp chào mừng cá nhân hóa khách mời nếu có tham số `?to=`.
  - 2 nút CTA: "Xác Nhận Tham Dự" cuộn đến `#rsvp`, "Xem Lịch Trình" cuộn đến `#events`.

---

### 3. `CoupleSection.tsx`
- **Mục đích:** Giới thiệu Chú Rể, Cô Dâu và gia đình hai bên.
- **Bố cục:**
  - 2 thẻ đối xứng: Thẻ Chú Rể (trái/trên) và Thẻ Cô Dâu (phải/dưới).
  - Ảnh chân dung trang trọng của từng người.
  - Tên song thân phụ mẫu hai gia đình (Ông Tỉnh - Bà Nga & Ông Hùng - Bà Huyền).
  - Quê quán rõ ràng tại Phúc Lộc, Hà Nội.

---

### 4. `StoryTimeline.tsx`
- **Mục đích:** Trình bày 4 cột mốc quan trọng trong tình yêu.
- **Cột mốc:**
  1. Tháng 8/2024: Ngày Đầu Gặp Gỡ
  2. 08.02.2025: Ngày Bước Chung Đôi
  3. 25.09.2026: Lời Cầu Hôn
  4. 29.11.2026: Chung Bước — Trọn Đời Hạnh Phúc
- **UX Di động:** Carousel vuốt ngang mượt mà với scroll-snap.

---

### 5. `EventDetails.tsx`
- **Mục đích:** Lịch trình chi tiết và chỉ đường.
- **2 Khối sự kiện:**
  1. Tiệc Cưới Chung Vui: 15:00 Thứ Bảy, 28/11/2026 tại Tư gia Nhà Gái.
  2. Lễ Thành Hôn / Vu Quy: 09:00 Chủ Nhật, 29/11/2026 tại Tư gia Nhà Gái & Nhà Trai.
- **Tương tác:**
  - Nút "Chỉ Đường Google Maps" dẫn chính xác đến địa chỉ.
  - Nút "Thêm Vào Lịch" (Google Calendar / Tải file .ics).
  - Bảng màu Dress code trang nhã với các vòng tròn màu trực quan.

---

### 6. `CountdownTimer.tsx` & `WeddingCalendar.tsx`
- **Mục đích:** Đếm ngược đến giây phút thành hôn và hiển thị lịch cưới.
- **Tính toán:** Dựa trên mốc ISO `2026-11-29T09:00:00+07:00`.
- **Hiệu ứng:** Rolling Digit Animation mượt mà, không giật số.
- **Lịch tháng 11/2026:** Đánh dấu trái tim ngày 28 và ngày 29 kèm hiển thị ngày âm lịch (21/10 Bính Ngọ).

---

### 7. `GallerySection.tsx` & `LightboxModal.tsx`
- **Mục đích:** Trưng bày 10 bức ảnh cưới nghệ thuật được tuyển chọn.
- **Bộ lọc danh mục:** Tất Cả (All) | Studio Cổ Điển | Sân Vườn Lãng Mạn | Cổ Phục Truyền Thống.
- **Lightbox:**
  - Phóng to ảnh không bị vỡ.
  - Nút Next / Previous và chỉ số ảnh (VD: 3 / 10).
  - Hỗ trợ vuốt chạm cảm ứng trên điện thoại sang trái/phải để chuyển ảnh.
  - Đóng khi bấm nền hoặc phím ESC.

---

### 8. `RsvpSection.tsx`
- **Mục đích:** Thu thập phản hồi tham dự từ khách mời.
- **Dữ liệu:**
  - Tên khách mời (bắt buộc, tự điền nếu có tham số URL).
  - Trạng thái tham dự: "Chắc chắn tham dự" hoặc "Rất tiếc không thể đến".
  - Số lượng người đi cùng: 1, 2, 3, 4, 5.
  - Số điện thoại (tùy chọn).
  - Lời nhắn gửi (tùy chọn).
- **Phản hồi:** Trạng thái gửi, thông báo thành công và hiệu ứng chúc mừng. Đồng bộ ngầm về Google Sheets.

---

### 9. `WishesSection.tsx` (Guestbook)
- **Mục đích:** Sổ lưu bút để khách mời để lại lời chúc tốt đẹp.
- **Tính năng:**
  - Nhập tên và nội dung lời chúc.
  - Hiển thị danh sách các lời chúc mới nhất lên đầu.
  - Lưu trữ bền vững tại LocalStorage.

---

### 10. `GiftSection.tsx`
- **Mục đích:** Kênh mừng cưới văn minh, trang trọng.
- **Khối tài khoản:**
  - Chú rể: TPBank — `0019 0019 202` — NGUYEN VAN NAM
  - Cô dâu: Techcombank — `7620 0022 22` — DOAN THI HIEP
- **Tính năng:**
  - Hiển thị mã QR VietQR rõ ràng.
  - Nút sao chép số tài khoản vào clipboard kèm Toast báo thành công.

---

### 11. `AudioPlayer` & Navigation Bars (`Navbar.tsx` & `MobileBottomBar.tsx`)
- **Mục đích:** Điều hướng và điều khiển âm nhạc trải nghiệm.
- **Âm thanh:** Tự kích hoạt theo gesture người dùng, có visualizer sóng âm, hỗ trợ bật/tắt mọi lúc.
- **Mobile Bottom Bar:** Cố định cạnh dưới màn hình di động giúp khách truy cập nhanh bất kỳ phân hệ nào.
