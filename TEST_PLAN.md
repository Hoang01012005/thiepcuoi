# TEST PLAN — LUXURY WEDDING INVITATION WEBSITE (Agent 5)

## 1. Objectives & Scope
This test plan defines the testing strategy, test cases, device matrices, and acceptance verification criteria for the redesign of the Wedding Invitation website (`https://github.com/Hoang01012005/thiepcuoi`).

---

## 2. Test Environments & Device Breakpoints

| Category | Target Resolutions / Viewports | Target Devices / Browsers |
| :--- | :--- | :--- |
| **Mobile Extra Small** | `320px x 568px` | iPhone SE (1st gen), compact Android |
| **Mobile Standard** | `375px x 667px`, `375px x 812px` | iPhone 8, iPhone X/XS/11 Pro |
| **Mobile Modern** | `390px x 844px`, `412px x 915px` | iPhone 12/13/14/15/16, Samsung Galaxy S23/S24 |
| **Tablet Portrait** | `768px x 1024px` | iPad Mini, iPad 9th/10th Gen |
| **Tablet Landscape / Laptop**| `1024px x 768px`, `1280px x 800px` | iPad Pro, MacBook Air 13" |
| **Desktop High-Res** | `1440px x 900px`, `1920px x 1080px` | Full HD / 2K monitors |

---

## 3. Test Cases Specification

### Suite TC-01: Envelope Opening Experience
- **TC-01.1**: Initial state displays unopened envelope with wax seal stamp "NH" and recipient name dedication if `?to=...` query param exists.
- **TC-01.2**: Clicking the wax seal triggers smooth flap unfolding animation, confetti burst, and music autoplay sequence.
- **TC-01.3**: After opening, envelope overlay fades out and reveals main wedding page without layout shift.
- **TC-01.4**: Opening state is preserved during the session (`hasOpenedEnvelope` in session/state).

### Suite TC-02: Music Player & Audio Visualizer
- **TC-02.1**: Audio unlocks safely on first user gesture (envelope click or music toggle).
- **TC-02.2**: Audio visualizer bars animate when playing and pause when muted.
- **TC-02.3**: Audio element loops seamlessly without stutter or clipping.

### Suite TC-03: Countdown Timer & Calendar
- **TC-03.1**: Countdown calculates target time `2026-11-28 15:00:00 GMT+7` accurately.
- **TC-03.2**: Rolling digit transition executes each second without UI flickering.
- **TC-03.3**: Interactive November 2026 calendar renders 30 days correctly with days 28 (Banquet) and 29 (Ceremony) highlighted.

### Suite TC-04: Photo Gallery & Lightbox
- **TC-04.1**: Gallery renders all 8 authentic wedding photos with proper WebP fallback to JPG.
- **TC-04.2**: Category filters ("Tất cả", "Khoảnh khắc", "Chân dung") filter items accurately.
- **TC-04.3**: Clicking any photo opens the full-screen Lightbox modal with zoom, next/previous buttons, and keyboard ESC to close.
- **TC-04.4**: Mobile touch gestures allow horizontal scrolling and modal dismissal.

### Suite TC-05: Google Maps & Calendar Integrations
- **TC-05.1**: "Chỉ đường" button for Nhà Gái links directly to Google Maps coordinates (`21.1398, 105.7196`).
- **TC-05.2**: "Chỉ đường" button for Nhà Trai links directly to Google Maps coordinates (`21.1402, 105.7198`).
- **TC-05.3**: "Thêm vào lịch" generates valid Google Calendar event URL with title, dates, and location pre-filled.

### Suite TC-06: Banking & Gift Registry
- **TC-06.1**: Groom card displays TPBank account `0334800366` (Nguyễn Văn Nam).
- **TC-06.2**: Bride card displays Techcombank account `8801012005` (Đoàn Thị Hiệp).
- **TC-06.3**: Clicking "Sao chép số tài khoản" copies account number to clipboard and shows "Đã sao chép!" toast.
- **TC-06.4**: "Mã QR chuyển khoản" opens high-definition QR modal for scanning with banking apps.

### Suite TC-07: RSVP Attendance Form
- **TC-07.1**: Form validates required fields (Full name, attendance choice).
- **TC-07.2**: Submitting form updates state instantly, saves to `localStorage` (`wedding_rsvp_submitted`), and fires background POST to Google Apps Script.
- **TC-07.3**: Shows elegant confirmation screen upon successful submission.

### Suite TC-08: Guestbook / Wishes Wall
- **TC-08.1**: Guest can enter name and blessing message up to 500 characters.
- **TC-08.2**: Input is sanitized against HTML/XSS injection before rendering.
- **TC-08.3**: New wish is prepended immediately to the wish feed and saved to `localStorage`.

### Suite TC-09: Responsive Design & Navigation Dock
- **TC-09.1**: Sticky header is visible on desktop and mobile.
- **TC-09.2**: Floating bottom dock bar displays on mobile viewports (<768px) and hides cleanly on desktop.
- **TC-09.3**: Language switcher toggles between Vietnamese and English across all UI labels seamlessly.
