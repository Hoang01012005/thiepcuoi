import React from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { PHOTO_REGISTRY } from '../../config/photos';
import { translations, type Language } from '../../config/translations';
import { FloralDivider } from '../common/FloralDivider';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useMagnetic } from '../../hooks/useMagnetic';
import { ArrowUp, Heart } from 'lucide-react';

interface ClosingSectionProps {
  lang: Language;
}

export const ClosingSection: React.FC<ClosingSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const { ref: sectionRef, isIntersecting } = useScrollReveal({ threshold: 0.15 });
  const topBtnRef = useMagnetic<HTMLButtonElement>(0.2);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={sectionRef}
      id="closing"
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #FDF7F4 0%, #F5ECE6 45%, #3B272E 100%)',
        paddingTop: '6rem',
        paddingBottom: '3.5rem',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Double Gilded Arch-Framed Photo #8 (Embrace Hug) */}
        <div
          className={`reveal-init ${isIntersecting ? 'is-revealed' : ''}`}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '340px',
            margin: '0 auto 3rem',
          }}
        >
          {/* Subtle Ambient Gold Hairline Offset */}
          <div
            style={{
              position: 'absolute',
              inset: '-10px',
              border: '1.5px solid rgba(213, 181, 140, 0.45)',
              borderRadius: 'var(--radius-arch)',
              pointerEvents: 'none',
              transform: 'translate(6px, 8px)',
            }}
          />

          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '2/3',
              borderRadius: 'var(--radius-arch)',
              overflow: 'hidden',
              border: '4px solid #FFF9F6',
              boxShadow: 'var(--shadow-paper-lg)',
              background: '#F7EFE9',
            }}
          >
            <picture>
              <source srcSet={PHOTO_REGISTRY.closing.src} type="image/webp" />
              <img
                src={PHOTO_REGISTRY.closing.srcJpg}
                alt={lang === 'vi' ? PHOTO_REGISTRY.closing.altVi : PHOTO_REGISTRY.closing.altEn}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                }}
                loading="lazy"
              />
            </picture>
          </div>
        </div>

        {/* Thank You Badge & Title */}
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--color-rose-dark)',
            background: 'rgba(255, 249, 246, 0.95)',
            border: '1px solid rgba(201, 130, 145, 0.35)',
            padding: '0.35rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {t.closing.thankYouBadge}
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            color: 'var(--color-plum)',
            maxWidth: '680px',
            margin: '0 auto 1rem',
            lineHeight: 1.2,
          }}
        >
          {t.closing.title}
        </h2>

        <FloralDivider variant="gold" />

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1.05rem',
            color: 'var(--color-text-muted)',
            maxWidth: '620px',
            margin: '1.5rem auto 2.75rem',
            lineHeight: 1.75,
            fontStyle: 'italic',
          }}
        >
          &ldquo;{t.closing.message}&rdquo;
        </p>

        {/* Signatures */}
        <div style={{ marginBottom: '3.5rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: 'var(--color-rose-dark)',
              margin: '0.5rem 0',
              lineHeight: 1.1,
            }}
          >
            {weddingConfig.couple.monogram}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              color: 'var(--color-plum)',
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}
          >
            {t.closing.signature}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.4rem',
            }}
          >
            {t.hero.weddingDate}
          </p>
        </div>

        {/* Back To Top Button */}
        <button
          ref={topBtnRef}
          type="button"
          onClick={scrollToTop}
          aria-label={t.nav.backToTop}
          className="magnetic-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.6rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.22)',
            border: '1px solid rgba(255, 255, 255, 0.45)',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.04em',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            marginBottom: '3rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.38)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <ArrowUp size={16} />
          <span>{t.nav.backToTop}</span>
        </button>

        {/* Copyright Footer */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '2.25rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span>{t.closing.copyright}</span>
            <Heart size={14} fill="rgba(201, 130, 145, 0.85)" stroke="none" />
          </div>

          {/* Discreet portal link for bride & groom */}
          <a
            href="#invite"
            title="Khu vực dâu rể tạo link thiệp riêng"
            style={{
              fontSize: '0.74rem',
              color: 'rgba(255, 255, 255, 0.35)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)')}
          >
            ✦ Quản lý tạo thiệp riêng
          </a>
        </div>
      </div>
    </footer>
  );
};
