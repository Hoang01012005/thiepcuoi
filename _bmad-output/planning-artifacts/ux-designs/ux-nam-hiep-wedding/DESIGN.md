---
name: Nam & Hiep Cinematic Wedding
description: Cinematic Interactive Digital Wedding Invitation design system for Nam & Hiep.
colors:
  ivory-paper: '#FFF9F6'
  blush-tint: '#FDF7F4'
  blush-petal: '#F3D5DA'
  blush-petal-deep: '#E8B4BE'
  dusty-rose: '#C98291'
  dusty-rose-dark: '#A85D6E'
  champagne-gold: '#D5B58C'
  champagne-gold-light: '#FFF0D6'
  champagne-gold-dark: '#A26B35'
  espresso-plum: '#49343A'
  plum-muted: '#9D737D'
  wax-seal-red: '#8C3947'
typography:
  font-serif: 'Cormorant Garamond, "Playfair Display", Georgia, serif'
  font-sans: '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  font-script: '"Alex Brush", "Great Vibes", cursive'
rounded:
  sm: '6px'
  md: '12px'
  lg: '20px'
  arch: '120px 120px 16px 16px'
  full: '9999px'
spacing:
  section-gap: 'clamp(4rem, 8vw, 7rem)'
  card-padding: 'clamp(1.75rem, 4.5vw, 3rem)'
components:
  envelope:
    unseal-duration: '0.8s'
    unseal-easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
    seal-glow: '0 0 25px rgba(201, 130, 145, 0.65)'
  stationery-card:
    border: '1px solid rgba(213, 181, 140, 0.4)'
    inset-border: '1px solid rgba(213, 181, 140, 0.25)'
    shadow: '0 8px 30px rgba(73, 52, 58, 0.08)'
  ambient-petals:
    particle-count: 24
    fps-target: 60
    sway-amplitude: 35
---

# Nam & Hiệp Wedding — Visual Design Specification

## Brand & Style
- **Aesthetic**: Cinematic Interactive Wedding Stationery.
- **Atmosphere**: Intimate, tactile, romantic, and celebratory.
- **Metaphor**: A luxury bespoke envelope arriving with real pressed flowers, gold foil embossing, and a personal dedication to the guest.

## Colors
- **Warm Ivory Background (`#FFF9F6`)**: Natural unbleached fine-art cotton paper.
- **Champagne Gold (`#D5B58C` / `#FFF0D6`)**: Gilded hairline frames, foil embossed text, and warm candlelight bokeh.
- **Dusty Rose (`#C98291`)**: Primary romantic action color, buttons, and heart badges.
- **Espresso Plum (`#49343A`)**: High contrast, rich editorial text that is softer than pure black.

## Motion & Micro-interactions
- **Gold Foil Shimmer**: Smooth linear-gradient translation over 3s infinite loop.
- **Audio Wave Visualizer**: 4 rhythmic bars oscillating in height from 4px to 18px.
- **Wax Seal Spring**: Scale(1.05) on hover, rotate(3deg) and radiant burst on activation.
- **Floating Petals**: Soft canvas alpha-blended petals rotating slowly and swaying with wind vectors.
