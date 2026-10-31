import React from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { PHOTO_REGISTRY } from '../../config/photos';
import { translations, type Language } from '../../config/translations';
import { SectionHeading } from '../common/SectionHeading';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Heart, MapPin } from 'lucide-react';

interface CoupleSectionProps {
  lang: Language;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const { groom, bride } = weddingConfig.couple;
  const { ref: sectionRef, isIntersecting } = useScrollReveal({ threshold: 0.15 });

  return (
    <section ref={sectionRef} id="couple" className="section-wrapper" style={{ backgroundColor: 'var(--color-ivory)' }}>
      <div className="container">
        <SectionHeading
          badge={t.couple.badge}
          title={t.couple.title}
          subtitle={t.couple.subtitle}
        />

        <div
          className="couple-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 5vw, 4rem)',
            marginTop: '3.5rem',
          }}
        >
          {/* Groom Card */}
          <div
            className={`stationery-card reveal-init ${isIntersecting ? 'is-revealed stagger-1' : ''}`}
            style={{
              padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <BotanicalCorner position="top-left" size={54} color="rgba(198, 164, 106, 0.45)" />
            {/* Top Traditional Honorific Tag */}
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-gold-dark)',
                background: 'rgba(198, 164, 106, 0.14)',
                border: '1px solid rgba(198, 164, 106, 0.4)',
                padding: '0.35rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1.75rem',
              }}
            >
              {lang === 'vi' ? 'Tân Lang — Nhà Trai' : "Groom's Side"}
            </span>

            {/* Museum Arched Portrait Frame */}
            <div
              className="couple-portrait-frame"
              style={{
                width: '190px',
                height: '255px',
                margin: '0 auto 1.75rem',
                borderRadius: '130px 130px 14px 14px',
                overflow: 'hidden',
                border: '3px solid #FFFFFF',
                boxShadow: '0 10px 30px rgba(64, 53, 47, 0.1), 0 0 0 1px rgba(198, 164, 106, 0.45)',
                background: 'var(--color-beige)',
              }}
            >
              <picture>
                <source srcSet={PHOTO_REGISTRY.groom.src} type="image/webp" />
                <img
                  src={PHOTO_REGISTRY.groom.srcJpg}
                  alt={lang === 'vi' ? PHOTO_REGISTRY.groom.altVi : PHOTO_REGISTRY.groom.altEn}
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

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-rose-dark)',
                fontWeight: 600,
                marginBottom: '0.3rem',
              }}
            >
              {lang === 'vi' ? groom.titleVi : groom.titleEn}
            </p>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.2rem)',
                fontWeight: 600,
                color: 'var(--color-plum)',
                marginBottom: '0.85rem',
              }}
            >
              {groom.fullName}
            </h3>

            {/* Hometown & Parents Info Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                margin: '1.25rem 0',
                border: '1px solid rgba(198, 164, 106, 0.3)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  color: 'var(--color-rose-dark)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '0.45rem',
                }}
              >
                <MapPin size={15} style={{ flexShrink: 0 }} />
                <span>{lang === 'vi' ? groom.hometownVi : groom.hometownEn}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {lang === 'vi' ? 'Thân sinh (Nhà Trai):' : t.couple.parentsTitle}
              </p>
              <p style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--color-plum)' }}>
                {lang === 'vi' ? groom.parentsVi : groom.parentsEn}
              </p>
            </div>

            {/* Bio */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.92rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                fontStyle: 'italic',
                maxWidth: '420px',
                margin: '0 auto',
              }}
            >
              &ldquo;{lang === 'vi' ? groom.bioVi : groom.bioEn}&rdquo;
            </p>
          </div>

          {/* Bride Card */}
          <div
            className={`stationery-card reveal-init ${isIntersecting ? 'is-revealed stagger-2' : ''}`}
            style={{
              padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <BotanicalCorner position="top-right" size={54} color="rgba(198, 164, 106, 0.45)" />
            {/* Top Traditional Honorific Tag */}
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-rose-dark)',
                background: 'rgba(201, 154, 154, 0.2)',
                border: '1px solid rgba(201, 154, 154, 0.4)',
                padding: '0.35rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1.75rem',
              }}
            >
              {lang === 'vi' ? 'Tân Nương — Nhà Gái' : "Bride's Side"}
            </span>

            {/* Museum Arched Portrait Frame */}
            <div
              className="couple-portrait-frame"
              style={{
                width: '190px',
                height: '255px',
                margin: '0 auto 1.75rem',
                borderRadius: '130px 130px 14px 14px',
                overflow: 'hidden',
                border: '3px solid #FFFFFF',
                boxShadow: '0 10px 30px rgba(64, 53, 47, 0.1), 0 0 0 1px rgba(198, 164, 106, 0.45)',
                background: 'var(--color-beige)',
              }}
            >
              <picture>
                <source srcSet={PHOTO_REGISTRY.bride.src} type="image/webp" />
                <img
                  src={PHOTO_REGISTRY.bride.srcJpg}
                  alt={lang === 'vi' ? PHOTO_REGISTRY.bride.altVi : PHOTO_REGISTRY.bride.altEn}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                  }}
                  loading="lazy"
                />
              </picture>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-rose-dark)',
                fontWeight: 600,
                marginBottom: '0.3rem',
              }}
            >
              {lang === 'vi' ? bride.titleVi : bride.titleEn}
            </p>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.2rem)',
                fontWeight: 600,
                color: 'var(--color-plum)',
                marginBottom: '0.85rem',
              }}
            >
              {bride.fullName}
            </h3>

            {/* Hometown & Parents Info Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                margin: '1.25rem 0',
                border: '1px solid rgba(198, 164, 106, 0.3)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  color: 'var(--color-rose-dark)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '0.45rem',
                }}
              >
                <MapPin size={15} style={{ flexShrink: 0 }} />
                <span>{lang === 'vi' ? bride.hometownVi : bride.hometownEn}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {lang === 'vi' ? 'Thân sinh (Nhà Gái):' : t.couple.parentsTitle}
              </p>
              <p style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--color-plum)' }}>
                {lang === 'vi' ? bride.parentsVi : bride.parentsEn}
              </p>
            </div>

            {/* Bio */}
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.92rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                fontStyle: 'italic',
                maxWidth: '420px',
                margin: '0 auto',
              }}
            >
              &ldquo;{lang === 'vi' ? bride.bioVi : bride.bioEn}&rdquo;
            </p>
          </div>
        </div>

        {/* Center Intertwined Hearts Icon */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-beige) 0%, #FFFFFF 100%)',
              border: '1px solid var(--color-gold)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Heart size={20} fill="var(--color-rose)" stroke="none" />
          </div>
        </div>
      </div>
    </section>
  );
};
