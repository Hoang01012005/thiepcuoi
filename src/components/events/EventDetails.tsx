import React, { useState } from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { translations, type Language } from '../../config/translations';
import { SectionHeading } from '../common/SectionHeading';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Clock, MapPin, ExternalLink, Copy, Check, Shirt } from 'lucide-react';

interface EventDetailsProps {
  lang: Language;
}

const SWATCH_NAMES: Record<string, { vi: string; en: string }> = {
  '#EEDBC5': { vi: 'Be', en: 'Beige' },
  '#FFF9ED': { vi: 'Kem', en: 'Cream' },
  '#C2A68C': { vi: 'Nâu nhạt', en: 'Soft Brown' },
  '#B8C9C4': { vi: 'Xanh pastel', en: 'Pastel Sage' },
  '#A7A6A6': { vi: 'Ghi xám', en: 'Warm Grey' },
};

export const EventDetails: React.FC<EventDetailsProps> = ({ lang }) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang];
  const { event } = weddingConfig;
  const { ref: sectionRef, isIntersecting } = useScrollReveal({ threshold: 0.15 });

  const handleCopyAddress = () => {
    const addr = lang === 'vi' ? event.reception.addressVi : event.reception.addressEn;
    navigator.clipboard.writeText(addr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section ref={sectionRef} id="event" className="section-wrapper" style={{ backgroundColor: '#FDF7F4' }}>
      <div className="container">
        <SectionHeading
          badge={t.event.badge}
          title={t.event.title}
          subtitle={t.event.subtitle}
        />

        {/* Event Stationery Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            marginTop: '3.5rem',
          }}
        >
          {/* 1. Traditional Ceremony Card */}
          <div
            className={`stationery-card reveal-init ${isIntersecting ? 'is-revealed stagger-1' : ''}`}
            style={{
              padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <BotanicalCorner position="top-left" size={54} color="rgba(213, 181, 140, 0.45)" />
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--color-gold-dark)',
                  background: 'rgba(213, 181, 140, 0.15)',
                  border: '1px solid rgba(213, 181, 140, 0.4)',
                  padding: '0.3rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '1.25rem',
                }}
              >
                Part I &bull; {lang === 'vi' ? 'Nghi Lễ Gia Tộc' : 'Solemn Ceremony'}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.1rem)',
                  color: 'var(--color-plum)',
                  lineHeight: 1.25,
                  marginBottom: '1.5rem',
                }}
              >
                {lang === 'vi' ? event.ceremony.nameVi : event.ceremony.nameEn}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <Clock size={19} style={{ color: 'var(--color-rose)', marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {t.event.timeLabel}
                    </p>
                    <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-plum)', marginTop: '0.15rem' }}>
                      {event.ceremony.time}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <MapPin size={19} style={{ color: 'var(--color-rose)', marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {t.event.venueLabel}
                    </p>
                    <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-plum)', marginTop: '0.15rem' }}>
                      {lang === 'vi' ? event.ceremony.venueVi : event.ceremony.venueEn}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                      {lang === 'vi' ? event.ceremony.addressVi : event.ceremony.addressEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '1.75rem',
                padding: '0.85rem 1rem',
                background: 'rgba(255, 249, 246, 0.9)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)',
                fontStyle: 'italic',
                border: '1px solid rgba(213, 181, 140, 0.3)',
              }}
            >
              {t.event.lunarDateLabel} {lang === 'vi' ? event.lunarDateVi : event.lunarDateEn}
            </div>
          </div>

          {/* 2. Wedding Banquet Reception Card */}
          <div
            className={`stationery-card reveal-init ${isIntersecting ? 'is-revealed stagger-2' : ''}`}
            style={{
              padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <BotanicalCorner position="top-right" size={54} color="rgba(201, 130, 145, 0.45)" />
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--color-rose-dark)',
                  background: 'rgba(243, 213, 218, 0.45)',
                  border: '1px solid rgba(201, 130, 145, 0.35)',
                  padding: '0.3rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: '1.25rem',
                }}
              >
                Part II &bull; {lang === 'vi' ? 'Tiệc Mừng Thân Mật' : 'Banquet Celebration'}
              </span>

              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.1rem)',
                  color: 'var(--color-plum)',
                  lineHeight: 1.25,
                  marginBottom: '1.5rem',
                }}
              >
                {lang === 'vi' ? event.reception.nameVi : event.reception.nameEn}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <Clock size={19} style={{ color: 'var(--color-rose)', marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {t.event.timeLabel}
                    </p>
                    <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-plum)', marginTop: '0.15rem' }}>
                      {event.reception.time}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <MapPin size={19} style={{ color: 'var(--color-rose)', marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {t.event.venueLabel}
                    </p>
                    <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-plum)', marginTop: '0.15rem' }}>
                      {lang === 'vi' ? event.reception.venueVi : event.reception.venueEn}
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                      {lang === 'vi' ? event.reception.addressVi : event.reception.addressEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Directions & Copy Address */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.75rem' }}>
              <a
                href={event.reception.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ flex: 1, minWidth: '170px', fontSize: '0.85rem', padding: '0.75rem 1.1rem' }}
              >
                <ExternalLink size={15} />
                <span>{t.event.getDirections}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="btn-outline"
                style={{ fontSize: '0.85rem', padding: '0.75rem 1.1rem' }}
                aria-label={t.event.copyAddress}
              >
                {copied ? <Check size={15} style={{ color: 'green' }} /> : <Copy size={15} />}
                <span>{copied ? t.event.copiedAddress : t.event.copyAddress}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* DRESS CODE VISUAL GUIDE — Premium Edition */}
        {/* ========================================= */}
        <div
          className={`stationery-card reveal-init ${isIntersecting ? 'is-revealed stagger-3' : ''}`}
          style={{
            maxWidth: '760px',
            margin: '3.5rem auto 0',
            padding: 'clamp(1.8rem, 4vw, 2.8rem) clamp(1.4rem, 4vw, 2.5rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <BotanicalCorner position="top-right" size={52} variant="champagne" />
          <BotanicalCorner position="bottom-left" size={52} variant="champagne" />

          {/* Section Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <Shirt size={18} style={{ color: 'var(--color-rose)' }} />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.73rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: 'var(--color-rose-dark)',
                background: 'rgba(243, 213, 218, 0.45)',
                border: '1px solid rgba(201, 130, 145, 0.3)',
                padding: '0.25rem 0.9rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {lang === 'vi' ? 'Dress Code' : 'Dress Code'}
            </span>
          </div>

          <h4
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)',
              color: 'var(--color-plum)',
              marginBottom: '0.5rem',
            }}
          >
            {t.event.dressCodeTitle}
          </h4>

          <p
            style={{
              fontSize: '0.92rem',
              color: 'var(--color-text-muted)',
              marginBottom: '2rem',
              lineHeight: 1.65,
              maxWidth: '520px',
              margin: '0 auto 2rem',
            }}
          >
            {lang === 'vi'
              ? 'Kính mời quý khách ưu tiên trang phục tông màu ấm áp, thanh lịch để ngày vui thêm hài hoà.'
              : 'We kindly suggest warm, elegant tones to create a harmonious and beautiful celebration together.'}
          </p>

          {/* Color Palette Swatches — Rich Visual */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: 'clamp(1rem, 3.5vw, 2rem)',
              flexWrap: 'wrap',
              marginBottom: '1.75rem',
            }}
          >
            {event.dressCode.colors.map((color, i) => {
              const swatchName = SWATCH_NAMES[color]
                ? (lang === 'vi' ? SWATCH_NAMES[color].vi : SWATCH_NAMES[color].en)
                : color;
              return (
                <div
                  key={i}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
                >
                  {/* Large swatch circle */}
                  <div
                    style={{
                      width: 'clamp(52px, 10vw, 68px)',
                      height: 'clamp(52px, 10vw, 68px)',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: '3px solid rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 6px 18px rgba(73, 52, 58, 0.18), inset 0 1px 3px rgba(255,255,255,0.5)',
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.12) translateY(-4px)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 28px rgba(73, 52, 58, 0.22), 0 0 0 4px ${color}55`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'scale(1) translateY(0)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 18px rgba(73, 52, 58, 0.18), inset 0 1px 3px rgba(255,255,255,0.5)';
                    }}
                    title={swatchName}
                    aria-label={swatchName}
                  />
                  {/* Color name label */}
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--color-plum)',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {swatchName}
                  </span>
                  {/* Hex sub-label */}
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: 'var(--color-text-muted)',
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {color}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Gentle disclaimer note */}
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              borderTop: '1px solid rgba(213, 181, 140, 0.3)',
              paddingTop: '1.25rem',
              marginTop: '0.5rem',
            }}
          >
            {lang === 'vi'
              ? '✦ Trang phục trắng thuần túy xin nhường cho cô dâu. Cảm ơn sự cảm thông của quý khách!'
              : '✦ Please reserve pure white for the bride. Thank you so much for your thoughtfulness!'}
          </p>
        </div>
      </div>
    </section>
  );
};
