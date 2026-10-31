# RESPONSIVE GUIDELINES — MOBILE-FIRST DESIGN
## Hướng Dẫn Tối Ưu Đa Màn Hình & Trải Nghiệm Di Động

---

### 1. Triết Lý Mobile-First
Hơn 92% khách mời sẽ mở thiệp cưới trên điện thoại di động thông qua ứng dụng Zalo, Messenger, tin nhắn SMS. Do đó:
- Mọi thiết kế, kích thước chữ, khoảng cách và nút bấm được căn chỉnh ưu tiên cho màn hình dọc điện thoại trước tiên.
- Không để xảy ra hiện tượng tràn màn hình ngang (horizontal scrolling/overflow).
- Mọi vùng chạm (Touch targets) có kích thước tối thiểu **44x44px** để người lớn tuổi và khách mời thao tác dễ dàng mà không bấm nhầm.

---

### 2. Các Mốc Breakpoints Chuẩn

| Breakpoint | Thiết bị tiêu biểu | Đặc tính hiển thị & Bố cục |
|---|---|---|
| **320px — 360px** | iPhone SE (Gen 1/2), Galaxy A-series nhỏ | Cỡ chữ co giãn nhẹ (fluid clamp), padding container 12px, các nút xếp dọc (stack vertical), 1 cột duy nhất. |
| **375px — 390px** | iPhone 12/13/14/15/16, Galaxy S23/S24 | Kích thước chuẩn phổ biến nhất. Khung ảnh Hero chiếm 78vw, thiệp mở nắp cân đối, thanh Mobile Bottom Bar hiển thị sắc nét. |
| **414px — 430px** | iPhone Plus / Pro Max, Galaxy Ultra | Tận dụng khoảng cách rộng rãi hơn, hình ảnh sắc nét, chữ rõ ràng. |
| **768px — 834px** | iPad Mini, iPad Air, Android Tablets | Chuyển dần sang bố cục 2 cột cho Couple và Event cards. Giữ thanh điều hướng trên cùng hoặc thanh bottom bar thích ứng. |
| **1024px — 1440px+**| Laptop, Macbook, Desktop màn hình rộng | Hiển thị Navbar thanh lịch trên đỉnh, hiệu ứng con trỏ chuột cao cấp (Luxury Cursor) và physics kéo từ tính (Magnetic buttons) được kích hoạt. |

---

### 3. Quy Tắc Chi Tiết Cho Từng Thành Phần Trên Mobile

1. **Envelope Cover:**
   - Chiều rộng phong bì: `min(90vw, 420px)`.
   - Chiều cao tỷ lệ vàng: `clamp(260px, 65vw, 320px)`.
   - Con dấu sáp ở giữa màn hình, dễ chạm bằng một ngón tay cái.
2. **Hero Section:**
   - Dáng vòm chân dung có tỷ lệ `2/3`, chiều rộng tối ưu `min(82vw, 320px)`.
   - Nút hành động CTA hiển thị rõ, không bị che khuất bởi thanh địa chỉ trình duyệt (sử dụng `100dvh` hoặc khoảng đệm hợp lý).
3. **Love Story Carousel:**
   - Sử dụng thẻ vuốt ngang `scroll-snap-type: x mandatory` với padding lề `1rem` để người dùng nhìn thấy một phần của thẻ tiếp theo, gợi ý vuốt trực quan.
4. **Gallery & Lightbox:**
   - Lưới ảnh 2 cột trên điện thoại (`grid-template-columns: repeat(2, 1fr)`).
   - Lightbox hỗ trợ gesture vuốt sang trái/phải để chuyển ảnh tiếp theo mà không cần phải bấm nút nhỏ.
5. **Form RSVP:**
   - Các nút chọn trạng thái "Chắc chắn tham dự" / "Rất tiếc không thể đến" to bản, hiển thị dạng thẻ chọn 1 chạm.
   - Bàn phím số tự động hiển thị khi nhập số điện thoại (`type="tel"`).
6. **Thanh điều hướng đáy (Mobile Bottom Bar):**
   - Cố định ở đáy (`position: fixed; bottom: 0; left: 0; right: 0; z-index: 998`).
   - Có khoảng cách an toàn `env(safe-area-inset-bottom)` cho iPhone có thanh Home Indicator.
