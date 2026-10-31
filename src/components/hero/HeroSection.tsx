import React from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { PHOTO_REGISTRY } from '../../config/photos';
import { translations, type Language } from '../../config/translations';
import { useGuestName } from '../../hooks/useGuestName';
import { useMagnetic } from '../../hooks/useMagnetic';
import { FloralDivider } from '../common/FloralDivider';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { Calendar, Heart, ChevronDown, Sparkles, MapPin, Clock } from 'lucide-react';
import { AddToCalendarButton } from '../common/AddToCalendarButton';

interface HeroSectionProps {
  lang: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const guestName = useGuestName();
  const t = translations[lang];

  // Magnetic physics for desktop action buttons
  const rsvpBtnRef = useMagnetic<HTMLAnchorElement>(0.25);
  const eventBtnRef = useMagnetic<HTMLAnchorElement>(0.2);

  // Common centerpiece photo element for crisp rendering in both responsive views
  const CenterpiecePortrait = (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* 1. Ambient Warm Champagne / Rose Halo radiating behind the arch */}
      <div
        style={{
          position: 'absolute',
          inset: '-20px -25px',
          borderRadius: 'inherit',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(198, 164, 106, 0.35) 0%, rgba(201, 154, 154, 0.2) 50%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* 2. Layered Luxury Gold Outline Frame (Off-center offset for couture editorial feel) */}
      <div
        style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: 'clamp(148px, 42vw, 185px) clamp(148px, 42vw, 185px) 28px 28px',
          border: '1.5px solid rgba(198, 164, 106, 0.45)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* 3. The Main Arched Portrait (100% full view of Nam & Hiệp with bridal bouquet) */}
      <div className="hero-portrait-frame" style={{ zIndex: 2 }}>
        <picture>
          <source srcSet={PHOTO_REGISTRY.hero.src} type="image/webp" />
          <img
            src={PHOTO_REGISTRY.hero.srcJpg}
            alt={lang === 'vi' ? PHOTO_REGISTRY.hero.altVi : PHOTO_REGISTRY.hero.altEn}
            className="ken-burns"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 15%',
              display: 'block',
              filter: 'saturate(1.05) contrast(1.02)',
            }}
            loading="eager"
          />
        </picture>

        {/* Subtle Bottom Vignette inside the arch to ground the white dress gently */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 72%, rgba(64, 53, 47, 0.16) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Luxury Gold Monogram Seal Badge (Top Right of Photo) */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FAF7F0 0%, #FFFFFF 100%)',
            border: '2px solid #C6A46A',
            boxShadow: '0 4px 16px rgba(64, 53, 47, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            padding: '4px',
          }}
        >
          <img
            src={weddingConfig.couple.logo.src}
            alt={weddingConfig.couple.logo.alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 1px 2px rgba(64, 53, 47, 0.25))',
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <section id="hero" className="hero-light-section">
      {/* Delicate Botanical Corner Flourishes */}
      <BotanicalCorner position="top-left" size={68} color="rgba(198, 164, 106, 0.45)" />
      <BotanicalCorner position="top-right" size={68} color="rgba(198, 164, 106, 0.45)" />

      {/* Ambient Sparkle Dust Canvas Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ============================================================== */}
      {/* MOBILE VIEW (< 992px): CENTERPIECE PORTRAIT AS VISUAL HIGHLIGHT */}
      {/* ============================================================== */}
      <div className="hero-mobile-view" style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Header: Badge, VIP Ribbon & Names */}
        <div style={{ marginBottom: '1.25rem' }}>
          {/* Save The Date Pill */}
          <div
            className="reveal-init is-revealed stagger-1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.38rem 1.15rem',
              background: '#FFFFFF',
              border: '1px solid #C6A46A',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 4px 14px rgba(64, 53, 47, 0.05)',
              marginBottom: '0.75rem',
            }}
          >
            <Calendar size={13} style={{ color: '#9F7E46' }} />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.76rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: '#5C4D44',
                textTransform: 'uppercase',
              }}
            >
              {t.hero.saveTheDate} • 28 &amp; 29 . 11 . 2026
            </span>
          </div>

          {/* VIP Guest Greeting Ribbon */}
          {guestName && (
            <div>
              <div
                className="reveal-init is-revealed stagger-2"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 1.35rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7F0 100%)',
                  border: '1.5px solid #C6A46A',
                  boxShadow: '0 4px 16px rgba(198, 164, 106, 0.25)',
                  marginBottom: '0.85rem',
                  fontSize: '0.9rem',
                  color: '#40352F',
                }}
              >
                <Sparkles size={14} style={{ color: '#9F7E46' }} />
                <span>
                  {lang === 'vi' ? 'Trân trọng kính mời ' : 'Cordially inviting '}
                  <strong style={{ color: '#A67575', fontWeight: 700, fontSize: '0.98rem' }}>
                    {guestName}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {/* Invitation Subtitle */}
          <p
            className="reveal-init is-revealed stagger-2"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.02rem',
              fontStyle: 'italic',
              color: '#7A6960',
              letterSpacing: '0.04em',
              marginBottom: '0.2rem',
            }}
          >
            {t.hero.invitationPrefix}
          </p>

          {/* Couple Names */}
          <h1
            className="reveal-init is-revealed stagger-3"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 8.5vw, 3.4rem)',
              fontWeight: 600,
              color: '#40352F',
              letterSpacing: '0.03em',
              lineHeight: 1.15,
              margin: '0.15rem 0 0.5rem',
            }}
          >
            <span>{weddingConfig.couple.groom.fullName}</span>
            <span
              style={{
                display: 'inline-block',
                margin: '0 0.5rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                color: '#C99A9A',
                fontSize: '0.86em',
              }}
            >
              &amp;
            </span>
            <span>{weddingConfig.couple.bride.fullName}</span>
          </h1>
        </div>

        {/* Centerpiece Full Arch Portrait */}
        <div className="reveal-init is-revealed stagger-3" style={{ margin: '0.5rem 0 1.5rem' }}>
          {CenterpiecePortrait}
        </div>

        {/* Date, Time & Venue Card */}
        <div className="reveal-init is-revealed stagger-4" style={{ marginBottom: '1.75rem', width: '100%' }}>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: 600,
              color: '#40352F',
              letterSpacing: '0.06em',
            }}
          >
            {t.hero.weddingDate}
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#5C4D44',
              fontSize: '0.92rem',
              marginTop: '0.25rem',
            }}
          >
            <Clock size={13} style={{ color: '#9F7E46' }} />
            <span>{t.hero.weddingDay}</span>
          </div>

          <div style={{ marginTop: '0.35rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.82rem',
                color: '#9F7E46',
                fontStyle: 'italic',
              }}
            >
              {lang === 'vi' ? weddingConfig.event.lunarDateVi : weddingConfig.event.lunarDateEn}
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginTop: '0.65rem',
              fontSize: '0.86rem',
              color: '#40352F',
              background: '#FFFFFF',
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(198, 164, 106, 0.6)',
              boxShadow: '0 2px 8px rgba(64, 53, 47, 0.05)',
            }}
          >
            <MapPin size={13} style={{ color: '#C99A9A' }} />
            <span>{weddingConfig.event.reception.venueVi}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="reveal-init is-revealed stagger-4"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <a
            href="#rsvp"
            className="btn-primary sheen-effect"
            style={{
              background: 'linear-gradient(135deg, #C6A46A 0%, #A38148 100%)',
              borderColor: '#C6A46A',
              color: '#FFFFFF',
              boxShadow: '0 6px 20px rgba(198, 164, 106, 0.35)',
              padding: '0.75rem 1.6rem',
              fontSize: '0.92rem',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Heart size={16} fill="currentColor" />
            <span>{translations[lang].rsvp.title}</span>
          </a>
          <a
            href="#event"
            className="btn-outline"
            style={{
              background: '#FFFFFF',
              borderColor: '#C6A46A',
              color: '#40352F',
              padding: '0.75rem 1.6rem',
              fontSize: '0.92rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 4px 12px rgba(64, 53, 47, 0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Calendar size={16} style={{ color: '#9F7E46' }} />
            <span>{translations[lang].event.title}</span>
          </a>
          <AddToCalendarButton lang={lang} />
        </div>
      </div>

      {/* ============================================================== */}
      {/* DESKTOP VIEW (>= 992px): 2-COLUMN LUXURY EDITORIAL SPREAD     */}
      {/* ============================================================== */}
      <div className="hero-desktop-view" style={{ position: 'relative', zIndex: 1 }}>
        {/* Left Column: Typography & Invitation Details */}
        <div style={{ textAlign: 'left', paddingRight: '1rem' }}>
          {/* Official Floral Monogram Logo */}
          <div
            className="reveal-init is-revealed stagger-1"
            style={{
              marginBottom: '1.25rem',
            }}
          >
            <img
              src={weddingConfig.couple.logo.src}
              alt={weddingConfig.couple.logo.alt}
              style={{
                width: 'clamp(76px, 8vw, 92px)',
                height: 'clamp(76px, 8vw, 92px)',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 14px rgba(64, 53, 47, 0.15))',
              }}
            />
          </div>

          {/* Save The Date Pill */}
          <div>
            <div
              className="reveal-init is-revealed stagger-1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1.3rem',
                background: '#FFFFFF',
                border: '1px solid #C6A46A',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1rem',
                boxShadow: '0 4px 14px rgba(64, 53, 47, 0.05)',
              }}
            >
              <Calendar size={13} style={{ color: '#9F7E46' }} />
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#5C4D44',
                }}
              >
                {t.hero.saveTheDate} • 28 &amp; 29 . 11 . 2026
              </span>
            </div>
          </div>

          {/* Personalized VIP Guest Ribbon */}
          {guestName && (
            <div>
              <div
                className="reveal-init is-revealed stagger-2"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.4rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7F0 100%)',
                  border: '1.5px solid #C6A46A',
                  marginBottom: '1.25rem',
                  fontSize: '0.94rem',
                  color: '#40352F',
                  boxShadow: '0 4px 18px rgba(198, 164, 106, 0.25)',
                }}
              >
                <Sparkles size={15} style={{ color: '#9F7E46' }} />
                <span>
                  {lang === 'vi' ? 'Trân trọng kính mời ' : 'Cordially inviting '}
                  <strong style={{ color: '#A67575', fontWeight: 700, fontSize: '1.04rem' }}>
                    {guestName}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {/* Subtitle / Invitation Prefix */}
          <p
            className="reveal-init is-revealed stagger-2"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              fontStyle: 'italic',
              color: '#7A6960',
              letterSpacing: '0.04em',
              marginBottom: '0.4rem',
            }}
          >
            {t.hero.invitationPrefix}
          </p>

          {/* Grand Couple Names */}
          <h1
            className="reveal-init is-revealed stagger-3"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3rem, 4.5vw, 4.5rem)',
              fontWeight: 600,
              color: '#40352F',
              letterSpacing: '0.03em',
              lineHeight: 1.15,
              margin: '0.25rem 0 1rem',
            }}
          >
            <span>{weddingConfig.couple.groom.fullName}</span>
            <span
              style={{
                display: 'inline-block',
                margin: '0 0.75rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                color: '#C99A9A',
                fontSize: '0.88em',
              }}
            >
              &amp;
            </span>
            <span>{weddingConfig.couple.bride.fullName}</span>
          </h1>

          <div style={{ margin: '1rem 0' }}>
            <FloralDivider variant="gold" />
          </div>

          {/* Date & Location Highlight */}
          <div className="reveal-init is-revealed stagger-4" style={{ marginBottom: '2.25rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#40352F',
                letterSpacing: '0.08em',
              }}
            >
              {t.hero.weddingDate}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
              <Clock size={15} style={{ color: '#9F7E46' }} />
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.98rem',
                  color: '#5C4D44',
                }}
              >
                {t.hero.weddingDay}
              </p>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                color: '#9F7E46',
                fontStyle: 'italic',
                marginTop: '0.25rem',
              }}
            >
              {lang === 'vi' ? weddingConfig.event.lunarDateVi : weddingConfig.event.lunarDateEn}
            </p>

            {/* Venue Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                marginTop: '0.85rem',
                fontSize: '0.88rem',
                color: '#40352F',
                background: '#FFFFFF',
                padding: '0.45rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid rgba(198, 164, 106, 0.6)',
                boxShadow: '0 2px 10px rgba(64, 53, 47, 0.05)',
              }}
            >
              <MapPin size={14} style={{ color: '#C99A9A' }} />
              <span>{weddingConfig.event.reception.venueVi}</span>
            </div>
          </div>

          {/* Magnetic CTA Buttons */}
          <div
            className="reveal-init is-revealed stagger-4"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <a
              ref={rsvpBtnRef}
              href="#rsvp"
              className="btn-primary magnetic-btn sheen-effect"
              style={{
                background: 'linear-gradient(135deg, #C6A46A 0%, #A38148 100%)',
                borderColor: '#C6A46A',
                color: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(198, 164, 106, 0.35)',
                padding: '0.85rem 1.9rem',
                fontSize: '0.96rem',
              }}
            >
              <Heart size={16} fill="currentColor" />
              <span>{translations[lang].rsvp.title}</span>
            </a>
            <a
              ref={eventBtnRef}
              href="#event"
              className="btn-outline magnetic-btn"
              style={{
                background: '#FFFFFF',
                borderColor: '#C6A46A',
                color: '#40352F',
                padding: '0.85rem 1.9rem',
                fontSize: '0.96rem',
                boxShadow: '0 4px 16px rgba(64, 53, 47, 0.06)',
              }}
            >
              <Calendar size={16} style={{ color: '#9F7E46' }} />
              <span>{translations[lang].event.title}</span>
            </a>
            <AddToCalendarButton lang={lang} />
          </div>
        </div>

        {/* Right Column: Majestic Arched Centerpiece Portrait */}
        <div
          className="reveal-init is-revealed stagger-3"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {CenterpiecePortrait}
        </div>
      </div>

      {/* Floating Scroll Down Indicator with Bouncing Chevron */}
      <a
        href="#couple"
        aria-label={t.hero.scrollDown}
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: '#7A6960',
          fontSize: '0.74rem',
          fontFamily: 'var(--font-sans)',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          animation: 'floatSlow 2.5s infinite ease-in-out',
          zIndex: 3,
          textDecoration: 'none',
        }}
      >
        <span>{t.hero.scrollDown}</span>
        <ChevronDown size={17} style={{ color: '#9F7E46' }} />
      </a>
    </section>
  );
};
