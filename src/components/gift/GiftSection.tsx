import React, { useState } from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { translations, type Language } from '../../config/translations';
import { SectionHeading } from '../common/SectionHeading';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Gift, Copy, Check, QrCode } from 'lucide-react';

interface GiftSectionProps {
  lang: Language;
}

export const GiftSection: React.FC<GiftSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const { gift } = weddingConfig;
  const [copiedGroom, setCopiedGroom] = useState(false);
  const [copiedBride, setCopiedBride] = useState(false);
  const [activeSide, setActiveSide] = useState<'groom' | 'bride'>('groom');
  const { ref: sectionRef, isIntersecting } = useScrollReveal({ threshold: 0.15 });

  if (!gift.enabled) return null;

  const copyToClipboard = (text: string, type: 'groom' | 'bride') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'groom') {
        setCopiedGroom(true);
        setTimeout(() => setCopiedGroom(false), 2500);
      } else {
        setCopiedBride(true);
        setTimeout(() => setCopiedBride(false), 2500);
      }
    });
  };

  return (
    <section ref={sectionRef} id="gift" className="section-wrapper">
      <div className="container">
        <SectionHeading
          badge={t.gift.badge}
          title={t.gift.title}
          subtitle={t.gift.subtitle}
        />

        {/* Mobile Tab Switcher */}
        <div
          className="gift-mobile-tabs"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.65rem',
            margin: '2rem auto 0',
            maxWidth: '360px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveSide('groom')}
            style={{
              flex: 1,
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              fontWeight: activeSide === 'groom' ? 700 : 500,
              background: activeSide === 'groom' ? 'linear-gradient(135deg, #FFF9F6 0%, #F5ECE6 100%)' : 'rgba(255, 255, 255, 0.6)',
              color: activeSide === 'groom' ? 'var(--color-rose-dark)' : 'var(--color-plum)',
              border: activeSide === 'groom' ? '1.5px solid var(--color-rose)' : '1px solid rgba(213, 181, 140, 0.4)',
              boxShadow: activeSide === 'groom' ? '0 4px 12px rgba(201, 130, 145, 0.25)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            🤵 {lang === 'vi' ? 'Nhà Trai (Nam)' : "Groom's Side"}
          </button>
          <button
            type="button"
            onClick={() => setActiveSide('bride')}
            style={{
              flex: 1,
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              fontWeight: activeSide === 'bride' ? 700 : 500,
              background: activeSide === 'bride' ? 'linear-gradient(135deg, #FFF9F6 0%, #F5ECE6 100%)' : 'rgba(255, 255, 255, 0.6)',
              color: activeSide === 'bride' ? 'var(--color-rose-dark)' : 'var(--color-plum)',
              border: activeSide === 'bride' ? '1.5px solid var(--color-rose)' : '1px solid rgba(213, 181, 140, 0.4)',
              boxShadow: activeSide === 'bride' ? '0 4px 12px rgba(201, 130, 145, 0.25)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            👰 {lang === 'vi' ? 'Nhà Gái (Hiệp)' : "Bride's Side"}
          </button>
        </div>

        <div
          className="gift-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            maxWidth: '860px',
            margin: '2rem auto 0',
          }}
        >
          {/* Groom Bank Card */}
          <div
            className={`stationery-card gift-card-groom ${activeSide === 'bride' ? 'hide-on-mobile' : ''} reveal-init ${isIntersecting ? 'is-revealed stagger-1' : ''}`}
            style={{
              padding: 'clamp(2rem, 5vw, 2.75rem) clamp(1.5rem, 4vw, 2.25rem)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <BotanicalCorner position="top-left" size={54} color="rgba(213, 181, 140, 0.45)" />
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(213, 181, 140, 0.2)',
                border: '1px solid rgba(213, 181, 140, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <Gift size={22} style={{ color: 'var(--color-gold-dark)' }} />
            </div>

            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                color: 'var(--color-plum)',
                marginBottom: '1.25rem',
              }}
            >
              {t.gift.groomSide}
            </h4>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid rgba(213, 181, 140, 0.3)',
                textAlign: 'left',
                marginBottom: '1.5rem',
              }}
            >
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t.gift.bankName}
              </p>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-plum)', marginBottom: '0.65rem' }}>
                {gift.groomBank.bankName}
              </p>

              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t.gift.accountNumber}
              </p>
              <p
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-rose-dark)',
                  letterSpacing: '0.06em',
                  fontFamily: 'monospace',
                  marginBottom: '0.65rem',
                }}
              >
                {gift.groomBank.accountNumber}
              </p>

              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t.gift.accountHolder}
              </p>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-plum)' }}>
                {gift.groomBank.accountHolder}
              </p>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(gift.groomBank.accountNumber, 'groom')}
              className="btn-outline"
              style={{ width: '100%', fontSize: '0.9rem', padding: '0.75rem' }}
            >
              {copiedGroom ? <Check size={16} style={{ color: 'green' }} /> : <Copy size={16} />}
              <span>{copiedGroom ? t.gift.copiedBtn : t.gift.copyBtn}</span>
            </button>
          </div>

          {/* Bride Bank Card */}
          <div
            className={`stationery-card gift-card-bride ${activeSide === 'groom' ? 'hide-on-mobile' : ''} reveal-init ${isIntersecting ? 'is-revealed stagger-2' : ''}`}
            style={{
              padding: 'clamp(2rem, 5vw, 2.75rem) clamp(1.5rem, 4vw, 2.25rem)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <BotanicalCorner position="top-right" size={54} color="rgba(201, 130, 145, 0.45)" />
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(243, 213, 218, 0.45)',
                border: '1px solid rgba(201, 130, 145, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <QrCode size={22} style={{ color: 'var(--color-rose)' }} />
            </div>

            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                color: 'var(--color-plum)',
                marginBottom: '1.25rem',
              }}
            >
              {t.gift.brideSide}
            </h4>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid rgba(201, 130, 145, 0.3)',
                textAlign: 'left',
                marginBottom: '1.5rem',
              }}
            >
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t.gift.bankName}
              </p>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-plum)', marginBottom: '0.65rem' }}>
                {gift.brideBank.bankName}
              </p>

              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t.gift.accountNumber}
              </p>
              <p
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-rose-dark)',
                  letterSpacing: '0.06em',
                  fontFamily: 'monospace',
                  marginBottom: '0.65rem',
                }}
              >
                {gift.brideBank.accountNumber}
              </p>

              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t.gift.accountHolder}
              </p>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-plum)' }}>
                {gift.brideBank.accountHolder}
              </p>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(gift.brideBank.accountNumber, 'bride')}
              className="btn-outline"
              style={{ width: '100%', fontSize: '0.9rem', padding: '0.75rem' }}
            >
              {copiedBride ? <Check size={16} style={{ color: 'green' }} /> : <Copy size={16} />}
              <span>{copiedBride ? t.gift.copiedBtn : t.gift.copyBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
