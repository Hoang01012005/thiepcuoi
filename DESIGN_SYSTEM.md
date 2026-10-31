# DESIGN SYSTEM — LUXURY WEDDING INVITATION WEBSITE
## Phong Cách: Luxury Romantic · Editorial Wedding · Minimalist Premium · Korean Aesthetic

---

### 1. Triết Lý Thiết Kế (Design Philosophy)
Hệ thống thiết kế lấy cảm hứng từ những ấn phẩm thiệp cưới cao cấp hoàng gia và phong cách ảnh cưới hiện đại Hàn Quốc (Korean Wedding Aesthetic):
- **Sự tĩnh lặng & Tinh khôi:** Sử dụng tỷ lệ khoảng trắng (white-space) hào phóng, tạo cảm giác thư thái và trân trọng.
- **Tính trật tự & Biên tập (Editorial Layout):** Bố cục ảnh bất đối xứng có chủ đích, vòm cong mềm mại (Architectural Arches), các đường kẻ chỉ vàng siêu mảnh (Hairline Champagne Rules).
- **Chất liệu thị giác (Tactile Textures):** Mô phỏng giấy mỹ thuật sần (Fine Linen / Handmade Cotton Paper), hiệu ứng dập sáp hoàng gia (3D Wax Seal) và pháo hoa kim tuyến vàng lấp lánh.

---

### 2. Bảng Màu Chủ Đạo (Signature Color Palette)

| Tên màu | Mã HEX | Vai trò trong hệ thống |
|---|---|---|
| **Ivory** | `#FAF7F0` | Nền chính toàn trang, tạo cảm giác mềm mại như lụa ngà tự nhiên |
| **Champagne Gold** | `#C6A46A` | Màu nhấn cao cấp: Viền vàng, con dấu sáp, icon, nút bấm kim loại |
| **Dusty Rose** | `#C99A9A` | Màu hồng tro lãng mạn: Điểm nhấn trái tim, trạng thái hover, badge |
| **Warm Beige** | `#E8DFD2` | Màu nền thẻ (Card surface), đường viền ngăn cách phụ, nền phong bì |
| **Deep Brown** | `#40352F` | Màu văn bản chính, tiêu đề trang trọng thay thế cho màu đen thô ráp |

#### Các sắc độ mở rộng hỗ trợ (Extended Accents)
- **Gold Light / Foil:** `#DFCA9E` (Ánh kim tuyến, viền lấp lánh)
- **Gold Dark:** `#A38148` (Bóng đổ dập sáp, text nổi)
- **Pure White:** `#FFFFFF` (Bề mặt thẻ nổi bật, popup lightbox)
- **Glass Tint:** `rgba(250, 247, 240, 0.88)` (Hiệu ứng kính mờ backdrop blur)

---

### 3. Hệ Thống Typography (Haute Couture Typography System)

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Playfair Display (Serif)                                            │
│    - Dùng cho: Tiêu đề chính (H1, H2), Tên Cô dâu & Chú rể, Monogram   │
│    - Đặc tính: Cổ điển, quý phái, đường nét thanh đậm rõ rệt           │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Cormorant Garamond (Serif)                                          │
│    - Dùng cho: Tiêu đề phụ, Số đếm ngược, Ngày tháng, Lời đề từ nghệ thuật│
│    - Đặc tính: Tinh tế, bay bổng, hơi thở thi ca lãng mạn              │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Be Vietnam Pro (Sans-serif)                                         │
│    - Dùng cho: Văn bản nội dung (Body text), Form RSVP, Nhãn nút bấm,  │
│      Lịch trình chi tiết, Thông tin tài khoản ngân hàng                │
│    - Đặc tính: Chuẩn tiếng Việt 100%, cực kỳ sắc nét trên màn hình     │
│      Retina di động và kích thước nhỏ (12px - 15px)                    │
└────────────────────────────────────────────────────────────────────────┘
```

#### Tỷ lệ cỡ chữ (Fluid Typography Scale)
- **Hero Title (Tên đôi uyên ương):** `clamp(2.4rem, 6.5vw, 4.5rem)`
- **Heading 1 / Section Titles:** `clamp(1.8rem, 4vw, 2.75rem)`
- **Heading 2 / Subtitles:** `clamp(1.25rem, 2.8vw, 1.75rem)`
- **Countdown Digits:** `clamp(2.2rem, 5.5vw, 4.0rem)`
- **Body Regular:** `clamp(0.92rem, 1.8vw, 1.05rem)`
- **Small / Metadata / Caption:** `clamp(0.75rem, 1.4vw, 0.85rem)`

---

### 4. Hệ Thống Thẻ & Bề Mặt (Surfaces & Stationery Cards)
- **Stationery Paper Card:**
  - Nền: `#FFFFFF` hoặc `#FAF7F0`
  - Viền kép: Viền ngoài `1px solid rgba(198, 164, 106, 0.35)`, viền trong thụt vào 6px `1px solid rgba(198, 164, 106, 0.18)`
  - Bóng đổ: `0 10px 30px -5px rgba(64, 53, 47, 0.08)`
  - Bo góc: `16px` (hoặc `radius-arch: 180px 180px 16px 16px` cho ảnh vòm).
- **Glassmorphism Header / Bar:**
  - Nền: `rgba(250, 247, 240, 0.85)`
  - Bộ lọc: `backdrop-filter: blur(16px)`
  - Viền dưới: `1px solid rgba(198, 164, 106, 0.2)`

---

### 5. Nút Bấm & Tương Tác (Buttons & Interactive Elements)
- **Primary Button (Nút chính - RSVP, Mở thiệp):**
  - Gradient: `linear-gradient(135deg, #C6A46A 0%, #B38E50 100%)`
  - Màu chữ: `#FFFFFF`
  - Viền bóng: `0 4px 18px rgba(198, 164, 106, 0.38)`
  - Bo tròn hoàn toàn: `9999px`
- **Secondary / Outline Button:**
  - Nền: `rgba(255, 255, 255, 0.7)`
  - Viền: `1.5px solid #C6A46A`
  - Màu chữ: `#40352F`
  - Hover: Đổi nền sang `#C6A46A`, chữ chuyển `#FFFFFF`

---

### 6. Nguyên Tắc Hoạt Cảnh & Chuyển Động (Motion Design)
- **Chuyển động tự nhiên:** Sử dụng cubic-bezier thanh lịch `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Không lạm dụng hoạt họa:** Các hiệu ứng chỉ xuất hiện khi có tương tác (mở nắp phong bì, cuộn trang hiện dần với threshold 0.15, lật ảnh lightbox).
- **Hỗ trợ Chế độ giảm chuyển động (`prefers-reduced-motion`):** Tự động tắt pháo hoa hoặc giảm thời gian animation xuống 0.01s cho người dùng kích hoạt giảm chuyển động trên thiết bị.

