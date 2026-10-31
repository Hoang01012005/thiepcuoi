# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## LUXURY ROMANTIC WEDDING INVITATION WEBSITE — HOÀNG NAM & NGỌC HIỆP

---

### 1. Giới thiệu & Mục tiêu (Introduction & Objectives)
- **Tên dự án:** Website Thiệp Cưới Cao Cấp Hoàng Nam & Ngọc Hiệp
- **Khách hàng mục tiêu:** Khách mời tham dự lễ cưới (bạn bè, đồng nghiệp, người thân, quan viên hai họ).
- **Mục tiêu sản phẩm:**
  - Cung cấp trải nghiệm nhận thiệp cưới trực tuyến sang trọng, giàu cảm xúc, chuẩn mực "Haute Couture & Luxury Romantic Wedding".
  - Giúp khách mời dễ dàng nắm bắt lịch trình, thời gian, địa điểm cưới kèm chỉ đường Google Maps và thêm sự kiện vào lịch điện tử chỉ với 1 chạm.
  - Cho phép khách mời xác nhận tham dự (RSVP) và gửi lời chúc phúc (Guestbook) nhanh chóng, dữ liệu được ghi nhận tức thì.
  - Cung cấp kênh nhận quà mừng cưới (VietQR) tiện lợi, minh bạch và lịch sự.
  - Đảm bảo trải nghiệm trên các dòng điện thoại thông minh (iPhone, Android) từ kích thước nhỏ (320px) đến lớn cực kỳ mượt mà, tốc độ tải tức thì.

---

### 2. Dữ liệu thực tế được bảo toàn tuyệt đối (Preserved Real Wedding Data)

#### 2.1. Đôi uyên ương (The Couple)
- **Chú rể:** Nguyễn Văn Nam (Tên thân mật: **Hoàng Nam**)
  - Quê quán: Số 22, ngõ 11, Bảo Lộc 2, Phúc Lộc, Hà Nội
  - Song thân: Ông Nguyễn Văn Tỉnh & Bà Đoàn Thị Nga
- **Cô dâu:** Đoàn Thị Hiệp (Tên thân mật: **Ngọc Hiệp**)
  - Quê quán: Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội
  - Song thân: Ông Đoàn Văn Hùng & Bà Đoàn Thị Huyền
- **Monogram biểu tượng:** `N & H`

#### 2.2. Sự kiện & Lịch trình (Wedding Events)
- **Lễ Thành Hôn / Vu Quy:**
  - Thời gian: **09:00 AM — Chủ Nhật, ngày 29 tháng 11 năm 2026** (Tức ngày 21 tháng 10 năm Bính Ngọ)
  - Địa điểm: Tư gia Nhà Gái & Nhà Trai (Bảo Lộc 2, Phúc Lộc, Hà Nội)
- **Tiệc Cưới Chung Vui (Banquet):**
  - Thời gian: **15:00 PM — Thứ Bảy, ngày 28 tháng 11 năm 2026**
  - Địa điểm: Tư gia Nhà Gái — Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội
  - Chỉ đường: Tọa độ Google Maps chính xác tại `Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội`.
- **Dress Code gợi ý:** Be · Kem · Nâu nhạt · Xanh pastel · Ghi xám (Mã màu: `#EEDBC5`, `#FFF9ED`, `#C2A68C`, `#B8C9C4`, `#A7A6A6`).

#### 2.3. Mừng cưới (Gift / Banking)
- **Nhà trai:** TPBank — Số tài khoản: `0019 0019 202` — Chủ TK: `NGUYEN VAN NAM` — Mã VietQR: `/assets/photos/qr-groom.png`
- **Nhà gái:** Techcombank — Số tài khoản: `7620 0022 22` — Chủ TK: `DOAN THI HIEP` — Mã VietQR: `/assets/photos/qr-bride.png`

#### 2.4. Âm nhạc nền (Soundtrack)
- Ca khúc: "Cưới Đi" — Đường dẫn: `/assets/audio/nhacnencuoidi.mp3`

---

### 3. Yêu cầu chức năng chi tiết (Functional Requirements)

| Mã yêu cầu | Phân hệ | Mô tả chi tiết | Tiêu chí hoàn thành |
|---|---|---|---|
| **FR-01** | Phong bì thiệp tương tác | Hiển thị phong bì sang trọng với con dấu sáp vàng N&H. Khi bấm "Mở thiệp", nắp phong bì mở 3D, thiệp trượt lên nhẹ nhàng kèm hiệu ứng pháo hoa champagne gold confetti. Có nút "Bỏ qua" cho người dùng muốn xem ngay. | Hoạt động trơn tru trên cả cảm ứng di động và chuột máy tính. |
| **FR-02** | Cá nhân hóa khách mời | Đọc tham số `?to=...`, `?guest=...`, `?name=...`, `?khach=...` từ URL. Hiển thị trang trọng trên mặt phong bì: "Trân trọng kính mời: [Tên khách mời]". Tự động điền vào ô Tên trong form RSVP. | Xử lý an toàn sanitize XSS, hiển thị đúng tiếng Việt có dấu. |
| **FR-03** | Hero Section | Chân dung cô dâu chú rể dáng vòm (Arch) quý phái, tên uyên ương typography Playfair Display, ngày cưới và nút kêu gọi hành động dẫn đến RSVP / Lịch trình. | Tải ảnh nhanh (WebP/JPG), bố cục cân đối trên mọi màn hình. |
| **FR-04** | Đôi uyên ương (Couple) | Giới thiệu hình ảnh, tiểu sử ngắn và tên song thân phụ mẫu hai gia đình. | Đầy đủ thông tin họ tên phụ mẫu hai bên. |
| **FR-05** | Câu chuyện tình yêu | 4 cột mốc thời gian: 8/2024 (Gặp gỡ), 8/2/2025 (Chung đôi), 25/9/2026 (Cầu hôn), 29/11/2026 (Ngày cưới). Kèm hình ảnh kỷ niệm tương ứng. | Hiển thị timeline mượt mà, trên mobile hỗ trợ vuốt chạm. |
| **FR-06** | Lịch trình & Bản đồ | 2 thẻ sự kiện: Tiệc Cưới (28/11) & Lễ Thành Hôn (29/11). Nút mở Google Maps chỉ đường chính xác và nút Thêm vào lịch (Google Calendar / Apple iCal). | Mở đúng link bản đồ và tải file .ics / tạo link calendar chuẩn múi giờ GMT+7. |
| **FR-07** | Đồng hồ đếm ngược | Đếm ngược Ngày - Giờ - Phút - Giây đến 09:00 29/11/2026. Lịch tháng 11/2026 làm nổi bật ngày 28 & 29. | Số đếm chính xác từng giây, hiệu ứng lăn số kinematic êm ái. |
| **FR-08** | Album ảnh cưới & Lightbox | 10 ảnh cưới nghệ thuật với 3 danh mục (Studio Cổ Điển, Sân Vườn Lãng Mạn, Cổ Phục Truyền Thống). Bấm vào ảnh mở Lightbox toàn màn hình, có nút Next/Prev và vuốt trên điện thoại. | Tối ưu lazy loading, ảnh sắc nét, Lightbox đóng mở mượt. |
| **FR-09** | Xác nhận tham dự (RSVP) | Form bao gồm: Tên khách mời, Trạng thái (Sẽ tham dự / Rất tiếc không thể đến), Số người đi cùng, Số điện thoại, Lời nhắn. Lưu vào LocalStorage và đồng bộ về Google Sheets qua Apps Script Web App. | Gửi thành công, có thông báo và hiệu ứng chúc mừng. |
| **FR-10** | Sổ lưu bút (Wishes/Guestbook) | Khách mời nhập tên và lời chúc phúc. Danh sách lời chúc hiển thị trang trọng dưới dạng thẻ nhật ký. Lưu trữ LocalStorage và cập nhật thời gian thực. | Lọc ký tự nguy hiểm, hiển thị ngày gửi thân thiện ("Vừa xong", "Hôm nay"). |
| **FR-11** | Hộp mừng cưới (Gift) | Hiển thị số tài khoản và mã QR của Nhà Trai (TPBank) & Nhà Gái (Techcombank). Nút sao chép số tài khoản 1 chạm (sao chép vào clipboard có toast báo thành công). | Copy đúng số tài khoản, QR quét ngân hàng nhận diện ngay. |
| **FR-12** | Trình phát nhạc (Audio Player) | Nút điều khiển âm thanh tinh tế với thanh sóng âm (visualizer wave). Phát ca khúc cưới lãng mạn. Tự động kích hoạt sau cử chỉ chạm đầu tiên của người dùng theo chính sách trình duyệt. | Không bị chặn âm thanh (Autoplay policy compliant), có thể bật/tắt bất kỳ lúc nào. |

---

### 4. Yêu cầu phi chức năng (Non-Functional Requirements)
- **Hiệu năng & Tốc độ:** Điểm Lighthouse Mobile Performance > 90. Dung lượng trang tối ưu, ảnh định dạng WebP hiện đại kèm JPG fallback.
- **Khả năng tương thích:** Tương thích Safari iOS, Chrome Android, Samsung Internet, Edge, Chrome Desktop, Firefox.
- **Bảo mật:** Tuân thủ CSP (Content Security Policy), HSTS, chống iframe clickjacking, sanitize toàn bộ input người dùng.
- **Khả năng tiếp cận (Accessibility):** Tương phản màu sắc đạt chuẩn WCAG AA, có hỗ trợ chế độ giảm chuyển động (`prefers-reduced-motion`).

