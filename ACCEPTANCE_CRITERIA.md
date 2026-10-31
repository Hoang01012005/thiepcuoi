# FEATURE LIST & ACCEPTANCE CRITERIA
## LUXURY WEDDING INVITATION WEBSITE — HOÀNG NAM & NGỌC HIỆP

---

### PHẦN 1: DANH SÁCH TÍNH NĂNG TOÀN DIỆN (FEATURE LIST)

1. **Interactive Royal Envelope Cover:**
   - Hoạt cảnh mở nắp 3D tương tác.
   - Con dấu dập sáp Monogram N&H màu vàng champagne.
   - Cá nhân hóa tên khách mời theo tham số URL.
   - Nút Skip (Bỏ qua) tiện dụng.
   - Bắn pháo hoa giấy champagne confetti khi mở.

2. **Luxury Editorial Hero:**
   - Khung ảnh cổng vòm (Arch) chân dung chính thức.
   - Typography Playfair Display & Cormorant Garamond.
   - Thông điệp chào mừng song ngữ (Việt / Anh).
   - Nút CTA nhanh: "Xác Nhận Tham Dự" & "Xem Lịch Trình".

3. **Couple Monogram & Family Profile:**
   - Chân dung riêng của Chú Rể Hoàng Nam & Cô Dâu Ngọc Hiệp.
   - Giới thiệu song thân phụ mẫu hai họ.
   - Thông tin quê quán trang trọng.

4. **Love Story Timeline (Hành trình yêu thương):**
   - 4 chương chuyện tình: Gặp gỡ -> Chung đôi -> Cầu hôn -> Về chung một nhà.
   - Ảnh kỷ niệm tương ứng từng mốc.
   - Hỗ trợ vuốt ngang mượt mà trên di động (Scroll-snap).

5. **Wedding Schedule & Interactive Maps:**
   - Chi tiết 2 sự kiện: Tiệc Cưới Chung Vui (28/11/2026) & Lễ Thành Hôn (29/11/2026).
   - Tích hợp nút mở Google Maps trực tiếp.
   - Nút tạo lịch Google Calendar & tải file iCal (.ics) chuẩn xác.
   - Dress code gợi ý với bảng màu trực quan.

6. **Precision Countdown Timer & Lunar Calendar:**
   - Bộ đếm ngược thời gian thực đến giây `2026-11-29T09:00:00+07:00`.
   - Hiệu ứng lăn số Kinematic Rolling Digit.
   - Lịch tháng 11/2026 hiển thị cả ngày dương lịch và âm lịch.

7. **Curated Photo Gallery & Mobile-Optimized Lightbox:**
   - 10 tác phẩm ảnh cưới chất lượng cao (Studio Cổ Điển, Sân Vườn Lãng Mạn, Cổ Phục Truyền Thống).
   - Bộ lọc danh mục chuyển đổi tức thì.
   - Lightbox toàn màn hình: phóng to, thu nhỏ, nút Previous/Next, hỗ trợ gesture vuốt chuyển ảnh trên mobile, phím Esc/Mũi tên trên bàn phím.

8. **Real-Time RSVP Form (Xác nhận tham dự):**
   - Form xác nhận tham dự với validation chặt chẽ.
   - Lưu trữ tại LocalStorage + Đồng bộ Google Sheets Web App.
   - Cơ chế phát sóng đồng bộ dữ liệu giữa các tab qua BroadcastChannel.
   - Xuất danh sách RSVP ra file CSV cho gia đình quản lý.

9. **Guestbook / Wishes Wall (Sổ lưu bút lời chúc):**
   - Gửi lời chúc phúc và hiển thị danh sách lời chúc theo thời gian thực.
   - Chống spam và lọc mã độc XSS.

10. **Wedding Gift / Banking Box (Hộp mừng cưới):**
    - Thông tin số tài khoản TPBank & Techcombank.
    - Mã VietQR chuẩn ngân hàng hiển thị sắc nét.
    - Nút bấm 1 chạm sao chép số tài khoản (Copy to clipboard) có toast thông báo.

11. **Background Audio Player:**
    - Phát nhạc lãng mạn "Cưới Đi".
    - Trực quan hóa sóng âm thanh (Audio visualizer bars).
    - Tự động kích hoạt khi có cử chỉ tương tác đầu tiên của người dùng.
    - Nút bật/tắt âm thanh cố định trên thanh điều hướng và thanh bar mobile.

12. **Mobile Navigation Bottom Bar:**
    - Thanh điều hướng nhanh ở cạnh đáy màn hình điện thoại (Trang chủ, Lịch trình, RSVP, Album, Âm nhạc).

13. **Language Switcher (Song ngữ Việt — Anh):**
    - Chuyển đổi ngôn ngữ hiển thị toàn bộ nội dung chỉ bằng 1 nút bấm.

---

### PHẦN 2: TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)

| Mã AC | Tiêu chí nghiệm thu | Phương thức kiểm tra | Kết quả yêu cầu |
|---|---|---|---|
| **AC-01** | **Bảo toàn dữ liệu** | So sánh nội dung hiển thị với dữ liệu thực tế trong `weddingConfig.ts` | 100% tên chú rể (Hoàng Nam), cô dâu (Ngọc Hiệp), ngày 28-29/11/2026, địa điểm, phụ mẫu hai bên, STK không bị sai lệch. |
| **AC-02** | **Mở phong bì** | Bấm nút con dấu "Mở Thiệp" trên desktop & mobile | Phong bì mở nắp 3D mượt mà, confetti champagne bắn lên, nhạc tự động phát, thiệp xuất hiện và chuyển vào trang chính. |
| **AC-03** | **Đếm ngược** | Xem thẻ Countdown Timer | Đếm ngược chính xác Ngày-Giờ-Phút-Giây đến 09:00:00 ngày 29/11/2026 (GMT+7). Khi đến ngày không bị âm số. |
| **AC-04** | **Album & Lightbox** | Bấm vào ảnh bất kỳ trong gallery | Lightbox mở ra toàn màn hình hiển thị ảnh rõ nét, bấm Next/Prev chuyển đúng ảnh, bấm đóng hoặc vuốt đóng hoạt động chuẩn xác. |
| **AC-05** | **Google Maps** | Bấm nút "Chỉ đường" ở từng sự kiện | Mở ứng dụng Google Maps hoặc tab mới dẫn đến tọa độ chính xác tại Phúc Lộc, Hà Nội. |
| **AC-06** | **Thêm vào lịch** | Bấm "Thêm vào lịch" | Tạo đúng sự kiện Google Calendar hoặc tải file `wedding-nam-hiep.ics` với thời gian chính xác từ 28-29/11/2026. |
| **AC-07** | **Gửi RSVP** | Nhập form RSVP và bấm gửi | Dữ liệu được lưu vào LocalStorage, phát BroadcastChannel và gửi request đồng bộ Google Sheet, hiển thị thông báo cảm ơn. |
| **AC-08** | **Sổ lưu bút** | Nhập tên và lời chúc phúc, bấm gửi | Lời chúc mới lập tức hiển thị trên đầu danh sách lời chúc, tồn tại sau khi tải lại trang. |
| **AC-09** | **Sao chép STK** | Bấm nút "Sao chép số tài khoản" | Clipboard chứa đúng số tài khoản, hiển thị toast "Đã sao chép thành công!". |
| **AC-10** | **Responsive Mobile** | Kiểm thử trên các kích thước 320px, 375px, 390px, 768px, 1024px, 1440px | Không có phần tử nào bị tràn chiều ngang (no horizontal overflow), văn bản dễ đọc, nút bấm kích thước tối thiểu 44x44px. |
| **AC-11** | **Chất lượng mã nguồn** | Chạy `npm run build` | Lệnh `tsc -b && vite build` hoàn thành với mã thoát 0, không có lỗi TypeScript hay cảnh báo nghiêm trọng. |
