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
        background: 'linear-gradient(180deg, var(--color-ivory) 0%, var(--color-warm-beige-light) 60%, var(--color-warm-beige) 100%)',
        paddingTop: '6rem',
        paddingBottom: '4.5rem',
        overflow: 'hidden',
        textAlign: 'center',
        borderTop: '1px solid rgba(198, 164, 106, 0.2)',
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
              border: '1.5px solid rgba(198, 164, 106, 0.45)',
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
              border: '4px solid var(--color-ivory)',
              boxShadow: 'var(--shadow-paper-lg)',
              background: 'var(--color-warm-beige-light)',
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
            color: 'var(--color-champagne-gold)',
            background: '#FFFFFF',
            border: '1px solid rgba(198, 164, 106, 0.4)',
            padding: '0.4rem 1.35rem',
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
            color: 'var(--color-deep-brown)',
            maxWidth: '680px',
            margin: '0 auto 1rem',
            lineHeight: 1.25,
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

        {/* Signatures & Authentic Circular Floral Monogram */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: 'clamp(120px, 22vw, 150px)',
                height: 'clamp(120px, 22vw, 150px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FAF7F0 0%, #FFFFFF 100%)',
                border: '2px solid rgba(198, 164, 106, 0.5)',
                padding: '10px',
                boxShadow: '0 10px 30px rgba(64, 53, 47, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={weddingConfig.couple.logo.src}
                alt={weddingConfig.couple.logo.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(64, 53, 47, 0.15))',
                }}
              />
            </div>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              color: 'var(--color-deep-brown)',
              letterSpacing: '0.12em',
              fontWeight: 700,
              marginTop: '0.5rem',
            }}
          >
            {t.closing.signature}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.92rem',
              fontWeight: 500,
              color: 'var(--color-text-muted)',
              marginTop: '0.4rem',
              letterSpacing: '0.04em',
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
          className="magnetic-btn sheen-effect"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.75rem 1.85rem',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #FAF7F0 0%, #FFFFFF 100%)',
            border: '1.5px solid var(--color-champagne-gold)',
            color: 'var(--color-deep-brown)',
            fontSize: '0.88rem',
            fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 4px 18px rgba(198, 164, 106, 0.22)',
            marginBottom: '3.5rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-champagne-gold)';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(198, 164, 106, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #FAF7F0 0%, #FFFFFF 100%)';
            e.currentTarget.style.color = 'var(--color-deep-brown)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 18px rgba(198, 164, 106, 0.22)';
          }}
        >
          <ArrowUp size={16} style={{ color: 'inherit' }} />
          <span>{t.nav.backToTop}</span>
        </button>

        {/* Copyright Footer */}
        <div
          style={{
            borderTop: '1px solid rgba(198, 164, 106, 0.25)',
            paddingTop: '2.25rem',
            color: 'var(--color-text-muted)',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span>{t.closing.copyright}</span>
            <Heart size={14} fill="var(--color-champagne-gold)" stroke="none" />
          </div>

          {/* Discreet portal link for bride & groom */}
          <a
            href="#invite"
            title="Khu vực dâu rể tạo link thiệp riêng"
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--color-champagne-gold)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              transition: 'all 0.2s ease',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(198, 164, 106, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(198, 164, 106, 0.18)';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(198, 164, 106, 0.08)';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            ✦ Quản lý tạo thiệp riêng
          </a>
        </div>
      </div>
    </footer>
  );
};
