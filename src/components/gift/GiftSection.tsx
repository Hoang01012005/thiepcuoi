import React, { useState } from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { translations, type Language } from '../../config/translations';
import { SectionHeading } from '../common/SectionHeading';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Gift, Copy, Check, QrCode, Maximize2, X } from 'lucide-react';

interface GiftSectionProps {
  lang: Language;
}

interface QrPreviewData {
  url: string;
  name: string;
  bank: string;
  stk: string;
  title: string;
}

export const GiftSection: React.FC<GiftSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const { gift } = weddingConfig;
  const [copiedGroom, setCopiedGroom] = useState(false);
  const [copiedBride, setCopiedBride] = useState(false);
  const [previewQr, setPreviewQr] = useState<QrPreviewData | null>(null);
  const { ref: sectionRef, isIntersecting } = useScrollReveal({ threshold: 0.15 });

  if (!gift.enabled) return null;

  const copyToClipboard = (text: string, type: 'groom' | 'bride') => {
    const cleanText = text.replace(/\s+/g, '');
    navigator.clipboard.writeText(cleanText).then(() => {
      if (type === 'groom') {
        setCopiedGroom(true);
        setTimeout(() => setCopiedGroom(false), 2500);
      } else {
        setCopiedBride(true);
        setTimeout(() => setCopiedBride(false), 2500);
      }
    });
  };

  const groomQr = gift.groomBank.qrUrl || `https://img.vietqr.io/image/TPB-${gift.groomBank.accountNumber.replace(/\s+/g, '')}-compact2.png?amount=0&addInfo=Mung%20Cuoi%20Hoang%20Nam%20Ngoc%20Hiep&accountName=${encodeURIComponent(gift.groomBank.accountHolder)}`;
  const brideQr = gift.brideBank.qrUrl || `https://img.vietqr.io/image/TCB-${gift.brideBank.accountNumber.replace(/\s+/g, '')}-compact2.png?amount=0&addInfo=Mung%20Cuoi%20Hoang%20Nam%20Ngoc%20Hiep&accountName=${encodeURIComponent(gift.brideBank.accountHolder)}`;

  return (
    <section ref={sectionRef} id="gift" className="section-wrapper">
      <div className="container">
        <SectionHeading
          badge={t.gift.badge}
          title={t.gift.title}
          subtitle={t.gift.subtitle}
        />

        {/* Dual Bank & QR Cards Displayed Song Song for Both Groom & Bride */}
        <div
          className="gift-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(1.5rem, 3.5vw, 2.75rem)',
            maxWidth: '1020px',
            margin: '2.5rem auto 0',
          }}
        >
          {/* Groom Bank & QR Card */}
          <div
            className={`stationery-card gift-card-groom reveal-init ${isIntersecting ? 'is-revealed stagger-1' : ''}`}
            style={{
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <BotanicalCorner position="top-left" size={54} color="rgba(198, 164, 106, 0.45)" />

            {/* Header Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(198, 164, 106, 0.16)', border: '1px solid rgba(198, 164, 106, 0.45)', padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', marginBottom: '1.25rem' }}>
              <Gift size={14} style={{ color: 'var(--color-gold-dark)' }} />
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-plum)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {t.gift.groomSide}
              </span>
            </div>

            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                color: 'var(--color-plum)',
                marginBottom: '1.5rem',
                fontWeight: 600,
              }}
            >
              {weddingConfig.couple.groom.fullName} — {lang === 'vi' ? 'Nhà Trai' : "Groom's Family"}
            </h4>

            {/* Song Song: QR Code + STK Details */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem',
              }}
            >
              {/* VietQR Code Frame */}
              <div
                onClick={() =>
                  setPreviewQr({
                    url: groomQr,
                    name: gift.groomBank.accountHolder,
                    bank: gift.groomBank.bankName,
                    stk: gift.groomBank.accountNumber,
                    title: `${weddingConfig.couple.groom.fullName} — ${t.gift.groomSide}`,
                  })
                }
                role="button"
                tabIndex={0}
                aria-label={`Phóng to mã QR ${gift.groomBank.accountHolder}`}
                style={{
                  background: '#FFFFFF',
                  padding: '0.75rem',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(198, 164, 106, 0.5)',
                  boxShadow: '0 8px 24px rgba(64, 53, 47, 0.08)',
                  width: '185px',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
              >
                <img
                  src={groomQr}
                  alt={`VietQR ${gift.groomBank.accountHolder}`}
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px' }}
                  loading="lazy"
                />
                <div
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.73rem',
                    color: 'var(--color-gold-dark)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <Maximize2 size={12} />
                  <span>{t.gift.enlargeQr}</span>
                </div>
              </div>

              {/* STK Details Card */}
              <div
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.92)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.1rem 1.25rem',
                  border: '1px solid rgba(198, 164, 106, 0.35)',
                  textAlign: 'left',
                }}
              >
                <div style={{ marginBottom: '0.65rem' }}>
                  <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>
                    {t.gift.bankName}
                  </p>
                  <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-plum)' }}>
                    {gift.groomBank.bankName}
                  </p>
                </div>

                <div style={{ marginBottom: '0.65rem' }}>
                  <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>
                    {t.gift.accountNumber}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--color-rose-dark)',
                        fontFamily: 'monospace',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {gift.groomBank.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(gift.groomBank.accountNumber, 'groom')}
                      style={{
                        padding: '0.35rem 0.8rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: '1px solid var(--color-gold-champagne)',
                        background: copiedGroom ? 'var(--color-gold-champagne)' : 'rgba(198, 164, 106, 0.2)',
                        color: copiedGroom ? '#FFFFFF' : 'var(--color-plum)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {copiedGroom ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedGroom ? t.gift.copiedBtn : t.gift.copyBtn}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>
                    {t.gift.accountHolder}
                  </p>
                  <p style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--color-plum)', letterSpacing: '0.05em' }}>
                    {gift.groomBank.accountHolder}
                  </p>
                </div>
              </div>

              {/* Full Width Copy Button */}
              <button
                type="button"
                onClick={() => copyToClipboard(gift.groomBank.accountNumber, 'groom')}
                className="btn-outline"
                style={{ width: '100%', fontSize: '0.88rem', padding: '0.7rem' }}
              >
                {copiedGroom ? <Check size={16} style={{ color: 'green' }} /> : <Copy size={16} />}
                <span>{copiedGroom ? t.gift.copiedBtn : t.gift.copyBtn}</span>
              </button>
            </div>
          </div>

          {/* Bride Bank & QR Card */}
          <div
            className={`stationery-card gift-card-bride reveal-init ${isIntersecting ? 'is-revealed stagger-2' : ''}`}
            style={{
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <BotanicalCorner position="top-right" size={54} color="rgba(201, 154, 154, 0.45)" />

            {/* Header Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(201, 154, 154, 0.2)', border: '1px solid rgba(201, 154, 154, 0.45)', padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', marginBottom: '1.25rem' }}>
              <QrCode size={14} style={{ color: 'var(--color-rose)' }} />
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-plum)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {t.gift.brideSide}
              </span>
            </div>

            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                color: 'var(--color-plum)',
                marginBottom: '1.5rem',
                fontWeight: 600,
              }}
            >
              {weddingConfig.couple.bride.fullName} — {lang === 'vi' ? 'Nhà Gái' : "Bride's Family"}
            </h4>

            {/* Song Song: QR Code + STK Details */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem',
              }}
            >
              {/* VietQR Code Frame */}
              <div
                onClick={() =>
                  setPreviewQr({
                    url: brideQr,
                    name: gift.brideBank.accountHolder,
                    bank: gift.brideBank.bankName,
                    stk: gift.brideBank.accountNumber,
                    title: `${weddingConfig.couple.bride.fullName} — ${t.gift.brideSide}`,
                  })
                }
                role="button"
                tabIndex={0}
                aria-label={`Phóng to mã QR ${gift.brideBank.accountHolder}`}
                style={{
                  background: '#FFFFFF',
                  padding: '0.75rem',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(201, 154, 154, 0.5)',
                  boxShadow: '0 8px 24px rgba(64, 53, 47, 0.08)',
                  width: '185px',
                  cursor: 'pointer',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
              >
                <img
                  src={brideQr}
                  alt={`VietQR ${gift.brideBank.accountHolder}`}
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px' }}
                  loading="lazy"
                />
                <div
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.73rem',
                    color: 'var(--color-rose-dark)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <Maximize2 size={12} />
                  <span>{t.gift.enlargeQr}</span>
                </div>
              </div>

              {/* STK Details Card */}
              <div
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.92)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.1rem 1.25rem',
                  border: '1px solid rgba(201, 154, 154, 0.35)',
                  textAlign: 'left',
                }}
              >
                <div style={{ marginBottom: '0.65rem' }}>
                  <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>
                    {t.gift.bankName}
                  </p>
                  <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-plum)' }}>
                    {gift.brideBank.bankName}
                  </p>
                </div>

                <div style={{ marginBottom: '0.65rem' }}>
                  <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>
                    {t.gift.accountNumber}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--color-rose-dark)',
                        fontFamily: 'monospace',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {gift.brideBank.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(gift.brideBank.accountNumber, 'bride')}
                      style={{
                        padding: '0.35rem 0.8rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: '1px solid var(--color-rose)',
                        background: copiedBride ? 'var(--color-rose)' : 'rgba(201, 154, 154, 0.2)',
                        color: copiedBride ? '#FFFFFF' : 'var(--color-rose-dark)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {copiedBride ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedBride ? t.gift.copiedBtn : t.gift.copyBtn}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>
                    {t.gift.accountHolder}
                  </p>
                  <p style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--color-plum)', letterSpacing: '0.05em' }}>
                    {gift.brideBank.accountHolder}
                  </p>
                </div>
              </div>

              {/* Full Width Copy Button */}
              <button
                type="button"
                onClick={() => copyToClipboard(gift.brideBank.accountNumber, 'bride')}
                className="btn-outline"
                style={{ width: '100%', fontSize: '0.88rem', padding: '0.7rem' }}
              >
                {copiedBride ? <Check size={16} style={{ color: 'green' }} /> : <Copy size={16} />}
                <span>{copiedBride ? t.gift.copiedBtn : t.gift.copyBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Zoom Modal */}
      {previewQr && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(64, 53, 47, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => setPreviewQr(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '2rem 1.5rem',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              border: '2px solid rgba(198, 164, 106, 0.6)',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setPreviewQr(null)}
              aria-label="Đóng"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(64, 53, 47, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-plum)',
              }}
            >
              <X size={18} />
            </button>

            <h4
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                color: 'var(--color-plum)',
                marginBottom: '1rem',
                paddingRight: '1.5rem',
              }}
            >
              {previewQr.title}
            </h4>

            <div
              style={{
                background: '#FFFFFF',
                padding: '0.85rem',
                borderRadius: '16px',
                border: '1.5px solid rgba(198, 164, 106, 0.5)',
                margin: '0 auto 1.25rem',
                maxWidth: '240px',
              }}
            >
              <img
                src={previewQr.url}
                alt={previewQr.name}
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px' }}
              />
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              {previewQr.bank}
            </p>
            <p
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--color-rose-dark)',
                fontFamily: 'monospace',
                marginBottom: '0.25rem',
              }}
            >
              {previewQr.stk}
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-plum)', marginBottom: '1.25rem' }}>
              {previewQr.name}
            </p>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(previewQr.stk.replace(/\s+/g, ''));
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
            >
              <Copy size={16} />
              <span>{t.gift.copyBtn} ({previewQr.stk})</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
