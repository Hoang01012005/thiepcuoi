# Nam & Hiệp Wedding — Experience & Interaction Specification

## 1. Guest Journey Architecture

```mermaid
graph TD
    A[Guest clicks link: ?to=Anh+Hoang] --> B[Envelope Ceremony with Custom Embossed Name]
    B --> C[Tap Wax Seal with Spring Physics & Audio Start]
    C --> D[Smooth 3D Envelope Unfold & Peek Card Glide]
    D --> E[Hero Section with Personal Greeting Ribbon]
    E --> F[Couple Museum Arches & Monograph Story Timeline]
    F --> G[Interactive 3-Column Editorial Gallery & Lightbox]
    G --> H[RSVP Pre-filled with Guest Name & Confetti Burst]
    H --> I[Wishes Guestbook Note Cards & Live Feed]
    I --> J[Gift Registry with 1-Click Copy Toast & Bank QR]
    J --> K[Closing Thank You Frame & Back to Top]
```

## 2. Dynamic Personalization Logic
- Query Parameter Schema:
  - `?to=<GuestName>`
  - `?guest=<GuestName>`
  - `?name=<GuestName>`
- Default fallback:
  - VI: `Quý Khách & Gia Đình`
  - EN: `Valued Guest & Family`
- Surface Touchpoints:
  1. **Envelope Cover**: Foil embossed name tag with gold shimmer.
  2. **Hero Section**: Dedicated welcome ribbon honoring the guest.
  3. **RSVP Form**: Pre-populates the Guest Name input so the guest doesn't need to retype their name.

## 3. Cinematic Micro-Animations
- **Floating Petals Component**: Gentle particle canvas with wind vector swaying, rendering soft petals & glowing bokeh.
- **Audio Equalizer Visualizer**: Visual indicator on the music button showing active harmony.
- **Wax Seal Ceremony**: Realistic tactile feedback on open.
