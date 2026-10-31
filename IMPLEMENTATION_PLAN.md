# IMPLEMENTATION PLAN — LUXURY WEDDING INVITATION REDESIGN
## Kế Hoạch Triển Khai Chi Tiết Từng Bước (Step-by-Step Execution Plan)

---

### MỤC TIÊU CỐT LÕI
Hiện đại hóa toàn diện giao diện website thiệp cưới sang phong cách **Luxury Romantic Wedding**, áp dụng đúng bảng màu (#FAF7F0, #C6A46A, #C99A9A, #E8DFD2, #40352F) và bộ font chữ (Playfair Display, Cormorant Garamond, Be Vietnam Pro), tối ưu hoàn hảo cho di động, trong khi giữ nguyên 100% dữ liệu cưới và các cấu hình Cloudflare Worker.

---

### GIAI ĐOẠN 3: TRIỂN KHAI PHẦN MỀM (IMPLEMENTATION)

#### Bước 3.1: Kiểm tra Backend & Cloudflare Worker (Phụ trách: Agent 4)
- Kiểm tra file `worker.js`, `wrangler.json`, `src/services/rsvpService.ts`.
- Đảm bảo CSP header trong `worker.js` cho phép Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), VietQR (`img.vietqr.io`), Google Sheets.
- Xác thực logic đồng bộ RSVP và export CSV.
- Xuất bản tài liệu: `API_DOCUMENTATION.md` & `BACKEND_REPORT.md`.

#### Bước 3.2: Tích hợp Typography & CSS Tokens (Phụ trách: Agent 3)
- Cập nhật `index.html`:
  - Thêm Google Fonts `Cormorant Garamond` (weights 400, 500, 600, 700 italic) và `Be Vietnam Pro` (weights 300, 400, 500, 600, 700) bên cạnh `Playfair Display`.
- Cập nhật `src/styles/variables.css`:
  - Khai báo chính xác các token màu sắc:
    - `--color-ivory: #FAF7F0;`
    - `--color-gold: #C6A46A;`
    - `--color-gold-champagne: #C6A46A;`
    - `--color-rose: #C99A9A;`
    - `--color-beige: #E8DFD2;`
    - `--color-brown: #40352F;`
  - Khai báo typography:
    - `--font-serif: 'Playfair Display', Didot, serif;`
    - `--font-display: 'Cormorant Garamond', serif;`
    - `--font-sans: 'Be Vietnam Pro', -apple-system, sans-serif;`
- Cập nhật `src/styles/index.css`:
  - Đảm bảo màu nền chính là `#FAF7F0`, màu chữ chính là `#40352F`.
  - Tinh chỉnh các gradient, nút bấm, thẻ giấy mỹ thuật và bóng đổ sang trọng.

#### Bước 3.3: Tinh Chỉnh & Nâng Cấp Từng Component (Phụ trách: Agent 3)
1. **EnvelopeCover:** Con dấu sáp vàng hoàng gia `#C6A46A`, thiệp màu Ivory và Warm Beige, mở nắp 3D nhẹ nhàng, confetti champagne.
2. **HeroSection:** Khung vòm champagne gold, tên uyên ương font Playfair Display, ngày cưới và nút CTA phong cách Luxury.
3. **CoupleSection:** Chân dung đối xứng, đầy đủ phụ mẫu hai gia đình, đường nét tinh tế.
4. **StoryTimeline:** Dòng thời gian 4 chương với hình ảnh kỷ niệm, hỗ trợ vuốt chạm di động.
5. **EventDetails:** 2 thẻ sự kiện Tiệc Cưới (28/11) & Lễ Thành Hôn (29/11), nút chỉ đường Google Maps và nút thêm lịch.
6. **CountdownTimer:** Đồng hồ đếm ngược với hiệu ứng rolling digit bằng font Cormorant Garamond / Playfair Display.
7. **GallerySection & LightboxModal:** Lưới ảnh 10 bức ảnh nghệ thuật, Lightbox phóng to sắc nét, vuốt chuyển ảnh mobile.
8. **RsvpSection & WishesSection:** Form đăng ký tham dự mượt mà, sổ lưu bút hiển thị trang nhã.
9. **GiftSection:** Thông tin chuyển khoản và mã VietQR sắc nét, copy 1 chạm.
10. **Audio & MobileBottomBar:** Nhạc nền tự phát sau tương tác đầu tiên, thanh điều hướng đáy điện thoại tiện lợi.
- Xuất bản tài liệu: `FRONTEND_REPORT.md`.

---

### GIAI ĐOẠN 4: KIỂM THỬ & TỐI ƯU HÓA (QA & OPTIMIZATION)

#### Bước 4.1: Kiểm thử toàn diện (Phụ trách: Agent 5)
- Soạn thảo `TEST_PLAN.md`.
- Kiểm thử responsive trên các breakpoint: 320px, 375px, 390px, 768px, 1024px, 1440px.
- Kiểm thử mở phong bì, tự động phát nhạc, đếm ngược, Lightbox, RSVP, Guestbook, Google Maps, Add to Calendar, Copy STK.
- Kiểm tra lỗi console hoặc lỗi layout.
- Xuất bản tài liệu: `BUG_REPORT.md` & `QA_REPORT.md`.

#### Bước 4.2: Tối ưu SEO, Core Web Vitals & Triển khai (Phụ trách: Agent 6)
- Tối ưu hóa font loading (`preconnect`, `display=swap`).
- Tối ưu Open Graph tags cho Zalo, Messenger, Facebook, Telegram.
- Soạn thảo hướng dẫn deploy an toàn lên Cloudflare Pages/Workers.
- Xuất bản tài liệu: `PERFORMANCE_REPORT.md`, `SEO_REPORT.md`, `DEPLOYMENT_GUIDE.md`.

---

### GIAI ĐOẠN 5: TÍCH HỢP & NGHIỆM THU (INTEGRATION & ACCEPTANCE)
- Chạy kiểm tra build: `npm run build` (`tsc -b && vite build`).
- Đối chiếu toàn bộ Acceptance Criteria trong `ACCEPTANCE_CRITERIA.md`.
- Đảm bảo 100% dữ liệu thiệp cưới được bảo toàn nguyên vẹn.
- Lập tài liệu nghiệm thu cuối cùng: `FINAL_REPORT.md`.
