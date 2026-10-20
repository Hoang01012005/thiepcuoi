import React from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { PHOTO_REGISTRY } from '../../config/photos';
import { translations, type Language } from '../../config/translations';
import { useGuestName } from '../../hooks/useGuestName';
import { useMagnetic } from '../../hooks/useMagnetic';
import { FloralDivider } from '../common/FloralDivider';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { Calendar, Heart, ChevronDown, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  lang: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const guestName = useGuestName();
  const t = translations[lang];

  // Magnetic hover physics on desktop buttons
  const rsvpBtnRef = useMagnetic<HTMLAnchorElement>(0.25);
  const eventBtnRef = useMagnetic<HTMLAnchorElement>(0.2);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 65px)',
        display: 'flex',
        alignItems: 'center',
        padding: '3.5rem 1.25rem 4.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Background Soft Radial Spotlight */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -20%)',
          width: '80vw',
          height: '60vh',
          background: 'radial-gradient(ellipse at center, rgba(243, 213, 218, 0.35) 0%, rgba(255, 249, 246, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        className="container hero-grid-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(2.5rem, 5vw, 5rem)',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Column: Editorial Wedding Typography */}
        <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
          {/* Save The Date Badge */}
          <div
            className="reveal-init is-revealed stagger-1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1.2rem',
              background: 'linear-gradient(135deg, rgba(243, 213, 218, 0.6) 0%, rgba(255, 249, 246, 0.9) 100%)',
              border: '1px solid rgba(213, 181, 140, 0.4)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Calendar size={14} style={{ color: 'var(--color-rose)' }} />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-rose-dark)',
              }}
            >
              {t.hero.saveTheDate}
            </span>
          </div>

          {/* Personalized VIP Guest Ribbon */}
          {guestName && (
            <div
              className="reveal-init is-revealed stagger-2"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, rgba(213, 181, 140, 0.18) 0%, rgba(243, 213, 218, 0.3) 100%)',
                border: '1px solid rgba(213, 181, 140, 0.5)',
                marginBottom: '1rem',
                fontSize: '0.88rem',
                color: 'var(--color-plum)',
                boxShadow: '0 2px 8px rgba(73, 52, 58, 0.05)',
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-gold-dark)' }} />
              <span>
                {lang === 'vi' ? 'Trân trọng đón tiếp ' : 'Warmly welcoming '}
                <strong style={{ color: 'var(--color-plum)', fontWeight: 700, fontSize: '0.98rem' }}>{guestName}</strong>
              </span>
            </div>
          )}

          <p
            className="reveal-init is-revealed stagger-2"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontStyle: 'italic',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.04em',
              lineHeight: 1.5,
              marginBottom: '0.5rem',
            }}
          >
            {t.hero.invitationPrefix}
          </p>

          {/* Couple Names — Grand Editorial Serif */}
          <h1
            className="reveal-init is-revealed stagger-3"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
              fontWeight: 600,
              color: 'var(--color-plum)',
              letterSpacing: '0.04em',
              lineHeight: 1.15,
              margin: '0.75rem 0',
            }}
          >
            <span>{weddingConfig.couple.groom.fullName}</span>
            <span
              style={{
                display: 'inline-block',
                margin: '0 0.65rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--color-rose)',
                fontSize: '0.9em',
              }}
            >
              &amp;
            </span>
            <span>{weddingConfig.couple.bride.fullName}</span>
          </h1>

          <FloralDivider variant="gold" />

          {/* Date & Location Highlight */}
          <div className="reveal-init is-revealed stagger-4" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                fontWeight: 600,
                color: 'var(--color-rose-dark)',
                letterSpacing: '0.1em',
              }}
            >
              {t.hero.weddingDate}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
                color: 'var(--color-text-muted)',
                marginTop: '0.35rem',
              }}
            >
              {t.hero.weddingDay}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                color: 'var(--color-gold-dark)',
                fontStyle: 'italic',
                marginTop: '0.25rem',
              }}
            >
              {lang === 'vi' ? weddingConfig.event.lunarDateVi : weddingConfig.event.lunarDateEn}
            </p>
          </div>

          {/* Magnetic CTA Buttons */}
          <div
            className="reveal-init is-revealed stagger-4"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              justifyContent: 'center',
            }}
          >
            <a ref={rsvpBtnRef} href="#rsvp" className="btn-primary magnetic-btn sheen-effect">
              <Heart size={16} fill="currentColor" />
              <span>{translations[lang].rsvp.title}</span>
            </a>
            <a ref={eventBtnRef} href="#event" className="btn-outline magnetic-btn">
              <Calendar size={16} />
              <span>{translations[lang].event.title}</span>
            </a>
          </div>
        </div>

        {/* Right Column: High-Fashion Framed Portrait with Ken Burns Zoom */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Decorative Gold Ambient Ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-14px',
              border: '1.5px solid rgba(213, 181, 140, 0.45)',
              borderRadius: 'var(--radius-arch)',
              pointerEvents: 'none',
              transform: 'translate(10px, 12px)',
            }}
          />

          {/* Arched Photo Frame Container with Ken Burns Slow Zoom */}
          <div
            className="hero-photo-frame"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '430px',
              aspectRatio: '2/3',
              borderRadius: 'var(--radius-arch)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg), 0 0 0 6px #FFF9F6, 0 0 0 8px rgba(201, 130, 145, 0.3)',
              background: '#F7EFE9',
            }}
          >
            {/* Subtle Botanical Corner Touches */}
            <BotanicalCorner position="top-left" size={60} color="rgba(213, 181, 140, 0.55)" />

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
                }}
                loading="eager"
              />
            </picture>

            {/* Subtle Gradient Veil at bottom of photo */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '35%',
                background: 'linear-gradient(to top, rgba(73, 52, 58, 0.45) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Small Monogram Seal on bottom right of photo */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                background: 'rgba(255, 249, 246, 0.92)',
                border: '1px solid var(--color-gold)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.8rem',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 4px 12px rgba(73, 52, 58, 0.1)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: 'var(--color-rose-dark)',
                }}
              >
                {weddingConfig.couple.monogram}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: 'var(--color-plum)',
                }}
              >
                2026
              </span>
            </div>
          </div>
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
          gap: '0.25rem',
          color: 'var(--color-text-muted)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-sans)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          animation: 'floatSlow 2.5s infinite ease-in-out',
          zIndex: 2,
        }}
      >
        <span>{t.hero.scrollDown}</span>
        <ChevronDown size={16} />
      </a>
    </section>
  );
};
