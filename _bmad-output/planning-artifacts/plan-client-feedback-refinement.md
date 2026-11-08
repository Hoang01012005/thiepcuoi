# KẾ HOẠCH CHI TIẾT THỰC THI PHẢN HỒI KHÁCH HÀNG (BMAD IMPLEMENTATION PLAN)

**Dự án:** Thiệp Cưới Cao Cấp Trực Tuyến  
**Cặp đôi:** Đoàn Hiệp & Nguyễn Nam  
**Ngày cưới:** 28 & 29 / 11 / 2026  
**Chuyên viên phân tích (BA):** Mary 📊  
**Trạng thái kế hoạch:** Đã cập nhật & Sẵn sàng triển khai  

---

## 1. TỔNG QUAN YÊU CẦU & MỤC TIÊU

Dựa trên phản hồi trực tiếp từ cô dâu và chú rể qua các ảnh chụp màn hình tin nhắn, kế hoạch này đặc tả 5 hạng mục điều chỉnh trọng yếu nhằm hoàn thiện trải nghiệm thẩm mỹ và độ chính xác thông tin:

1. **Định danh Cặp đôi:** Cập nhật họ tên hiển thị chuẩn xác thành **Đoàn Hiệp & Nguyễn Nam** (giữ nguyên logo và monogram biểu tượng `N & H`).
2. **Dress Code:** Thay đổi mã màu thứ 5 từ `Ghi xám (#A7A6A6)` sang **Hồng pastel (`#F8C8DC`)**.
3. **Chỉ đường Google Maps:** Tích hợp liên kết ghim vị trí chính xác của **"Hùng Huyền Home"** (`https://maps.app.goo.gl/FNr8a1kSXcdEnczY9`).
4. **Hiệu ứng Typography Chuyển động:** Bổ sung hiệu ứng chữ cuộn xuất hiện (`cinematic-text-group`, `reveal-soft`, `stagger-*`) cho khu vực **Cô Dâu & Chú Rể (`CoupleSection`)**.
5. **Giao diện Phong bì Thiệp mời:** Thay đổi bảng màu từ nâu trầm sang phong cách **Hồng Phấn Ánh Kim (Blush Gold & Champagne Luxury)** tươi sáng, rực rỡ và chuẩn không khí cưới hỏi.

---

## 2. ĐẶC TẢ KỸ THUẬT TỪNG HẠNG MỤC

### Hạng mục 1: Chuẩn hóa tên Cặp đôi thành "Đoàn Hiệp & Nguyễn Nam"
- **Mức độ ưu tiên:** P0 (Must Have)
- **Files tác động:**
  - `src/config/weddingConfig.ts`:
    - `couple.groom.fullName = 'Nguyễn Nam'`, `couple.groom.shortName = 'Nguyễn Nam'`
    - `couple.bride.fullName = 'Đoàn Hiệp'`, `couple.bride.shortName = 'Đoàn Hiệp'`
  - `index.html`:
    - Cập nhật `<title>`: `Đoàn Hiệp &amp; Nguyễn Nam — Thiệp Cưới | Wedding Invitation`
    - Cập nhật thẻ `meta[name="description"]` và `og:title`, `og:description`.
  - `worker.js`:
    - Cập nhật tiêu đề mặc định và `og:site_name`: `Thiệp Cưới Đoàn Hiệp &amp; Nguyễn Nam`.
  - `src/config/photos.ts`:
    - Cập nhật các trường `altVi`, `altEn` trong `PHOTO_REGISTRY` và `GALLERY_PHOTOS` để đồng bộ tên mới.

### Hạng mục 2: Cập nhật màu Dress Code sang "Hồng Pastel"
- **Mức độ ưu tiên:** P0 (Must Have)
- **Files tác động:**
  - `src/config/weddingConfig.ts`:
    - Sửa `event.dressCode.vi`: `'Be · Kem · Nâu nhạt · Xanh pastel · Hồng pastel'`
    - Sửa `event.dressCode.en`: `'Beige · Cream · Soft Brown · Pastel Sage · Pastel Pink'`
    - Sửa `event.dressCode.colors`:
      - Thay `#A7A6A6` bằng `#F8C8DC`.

### Hạng mục 3: Tích hợp Google Maps ghim chính xác "Hùng Huyền Home"
- **Mức độ ưu tiên:** P0 (Must Have)
- **Liên kết xác thực:** `https://maps.app.goo.gl/FNr8a1kSXcdEnczY9` (Ghim định danh: *Hùng Huyền Home*, Tọa độ: `21.1269223, 105.5682461`).
- **Files tác động:**
  - `src/config/weddingConfig.ts`:
    - `event.reception.mapUrl`: `'https://maps.app.goo.gl/FNr8a1kSXcdEnczY9'`
    - `event.reception.venueVi`: `'Tư Gia Nhà Gái (Hùng Huyền Home)'`
    - `event.reception.addressVi`: `'Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội (Hùng Huyền Home)'`
    - `event.ceremony.addressVi`: Cập nhật đồng bộ địa chỉ nhà gái kèm tên `(Hùng Huyền Home)`.
  - `src/components/events/EventDetails.tsx`:
    - Nút bấm `[Xem chỉ đường trên Google Maps]` kích hoạt liên kết mở ứng dụng Google Maps trực tiếp tới vị trí đã ghim.

### Hạng mục 4: Tích hợp hiệu ứng Kinetic Motion Reveal cho "CoupleSection"
- **Mức độ ưu tiên:** P1 (Should Have)
- **Files tác động:**
  - `src/components/couple/CoupleSection.tsx`:
    - Thêm các class và cấu trúc kinetic text reveal cho danh xưng, tên dâu rể, ảnh và phụ mẫu (`cinematic-text-group`, `reveal-soft`, `stagger-*`).
  - `src/styles/index.css`:
    - Bổ sung định kiểu chuyển động đảm bảo tốc độ và độ mượt (easing `cubic-bezier(0.2, 0.65, 0.25, 1)`).

### Hạng mục 5: Khoác áo mới cho Phong bì thiệp mời (Hồng Phấn Ánh Kim - Blush Gold)
- **Mức độ ưu tiên:** P1 (Should Have)
- **Phong cách thị giác:** Luxury Romantic Blush & Champagne Gold (Hồng Phấn Ánh Kim & Vàng Champagne).
- **Files tác động:**
  - `src/components/envelope/EnvelopeCover.tsx`:
    - **Vỏ ngoài phong bì (Outer Flaps & Body):** Gradient hồng phấn nhung cao cấp kết hợp ánh kem `linear-gradient(145deg, #F9EAE1 0%, #F5D5D8 45%, #EAAEB4 100%)`, viền chỉ vàng kim `rgba(212, 175, 55, 0.4)`.
    - **Lớp lót bên trong (Inner Envelope Lining):** Tông hoa hồng ánh kim quý phái `linear-gradient(180deg, #E8A5AC 0%, #C86D7C 100%)`.
    - **Vạt gấp đáy & 2 bên (Triangles):** Gradient đa tầng hồng ánh kim đồng bộ.
    - **Con dấu sáp hoàng gia (Wax Seal):** Màu vàng Gold Hoàng Gia (`#D4AF37`) dập nổi Monogram `N & H`.

