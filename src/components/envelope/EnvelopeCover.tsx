import React, { useState } from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { PHOTO_REGISTRY } from '../../config/photos';
import { translations, type Language } from '../../config/translations';
import { useGuestName } from '../../hooks/useGuestName';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { Sparkles, Heart } from 'lucide-react';

interface EnvelopeCoverProps {
  lang: Language;
  onOpen: () => void;
}

export const EnvelopeCover: React.FC<EnvelopeCoverProps> = ({ lang, onOpen }) => {
  // Animation sequence states: 'sealed' -> 'unsealing' -> 'card-rising' -> 'revealing-hero'
  const [animStage, setAnimStage] = useState<'sealed' | 'unsealing' | 'card-rising' | 'revealing-hero'>('sealed');
  const guestName = useGuestName();
  const t = translations[lang];

  const handleOpenClick = () => {
    if (animStage !== 'sealed') return;

    // Step 1: Wax seal breaks & Flap unfolds in 3D
    setAnimStage('unsealing');

    // Step 2: Card glides up from the pocket
    setTimeout(() => {
      setAnimStage('card-rising');
    }, 700);

    // Step 3: Cinematic reveal handover to Hero section
    setTimeout(() => {
      setAnimStage('revealing-hero');
    }, 1800);

    // Step 4: Final unmount & handover
    setTimeout(() => {
      onOpen();
    }, 2400);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
  };

  const isFlapOpen = animStage !== 'sealed';
  const isCardUp = animStage === 'card-rising' || animStage === 'revealing-hero';
  const isRevealing = animStage === 'revealing-hero';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.envelope.formalInvite}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#26171E',
        backgroundImage: `
          radial-gradient(circle at 50% 40%, rgba(201, 130, 145, 0.4) 0%, transparent 65%),
          radial-gradient(circle at 20% 80%, rgba(213, 181, 140, 0.2) 0%, transparent 55%),
          linear-gradient(180deg, #1C0F16 0%, #2E1A24 100%)
        `,
        padding: '1.25rem',
        overflow: 'hidden',
        perspective: '1400px',
        transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s ease',
        opacity: isRevealing ? 0 : 1,
        transform: isRevealing ? 'scale(1.06)' : 'scale(1)',
        pointerEvents: isRevealing ? 'none' : 'auto',
      }}
    >
      {/* Skip Button (Upper Right) */}
      <button
        type="button"
        onClick={handleSkip}
        aria-label={t.envelope.skipBtn}
        style={{
          position: 'absolute',
          top: 'clamp(1rem, 3vw, 2rem)',
          right: 'clamp(1rem, 3vw, 2rem)',
          zIndex: 40,
          background: 'rgba(255, 249, 246, 0.16)',
          border: '1px solid rgba(255, 249, 246, 0.35)',
          color: '#FFF9F6',
          padding: '0.45rem 1.15rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.04em',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 249, 246, 0.3)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 249, 246, 0.16)')}
      >
        {t.envelope.skipBtn} &rarr;
      </button>

      {/* Floating Golden Dust Highlights in Envelope Ambient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 30%, rgba(247, 229, 200, 0.12) 0%, transparent 60%)',
        }}
      />

      {/* Main 3D Envelope Scene Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          height: 'clamp(480px, 78vh, 620px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* PHYSICAL 3D ENVELOPE BASE */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '24px',
            boxShadow: '0 35px 80px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(213, 181, 140, 0.35)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* 1. Interior Pocket Backing (Champagne Silk Pattern) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '24px',
              background: 'linear-gradient(150deg, #F3EAE4 0%, #E6D7CE 100%)',
              border: '1.5px solid #D5B58C',
              overflow: 'hidden',
              zIndex: 1,
            }}
          >
            {/* Subtle Diamond Damask Pattern */}
            <div
              style={{
                position: 'absolute',
                inset: '12px',
                border: '1px solid rgba(213, 181, 140, 0.4)',
                borderRadius: '16px',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* 2. THE WEDDING INVITATION CARD (Slides out of pocket) */}
          <div
            style={{
              position: 'absolute',
              left: '4%',
              right: '4%',
              bottom: '5%',
              height: '92%',
              background: 'linear-gradient(160deg, #FFFFFF 0%, #FFF9F6 50%, #FAF0EB 100%)',
              borderRadius: '20px',
              border: '1.5px solid #E5CDB4',
              boxShadow: isCardUp
                ? '0 25px 60px rgba(47, 30, 36, 0.35), 0 0 0 1px rgba(213, 181, 140, 0.5)'
                : '0 8px 24px rgba(47, 30, 36, 0.15)',
              padding: 'clamp(1.5rem, 4vw, 2.4rem) clamp(1.2rem, 3.5vw, 2.2rem)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 2,
              transform: isCardUp
                ? 'translate3d(0, -90px, 30px) scale(1.02)'
                : 'translate3d(0, 0px, 0px) scale(1)',
              transition: 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.95s ease',
              overflow: 'hidden',
            }}
          >
            {/* Botanical Corner Flourishes on Card */}
            <BotanicalCorner position="top-left" size={54} color="rgba(213, 181, 140, 0.6)" />
            <BotanicalCorner position="top-right" size={54} color="rgba(213, 181, 140, 0.6)" />

            {/* Inner Gold Foil Hairline Border */}
            <div
              style={{
                position: 'absolute',
                inset: '8px',
                border: '1px solid rgba(213, 181, 140, 0.35)',
                borderRadius: '14px',
                pointerEvents: 'none',
              }}
            />

            {/* Arch Wedding Photo of Nam & Hiệp */}
            <div
              style={{
                position: 'relative',
                width: '105px',
                height: '135px',
                borderRadius: '55px 55px 10px 10px',
                overflow: 'hidden',
                border: '2px solid #D5B58C',
                boxShadow: '0 6px 18px rgba(73, 52, 58, 0.16)',
                background: '#F7EFE9',
                marginTop: '0.25rem',
                flexShrink: 0,
              }}
            >
              <picture>
                <source srcSet={PHOTO_REGISTRY.cover.src} type="image/webp" />
                <img
                  src={PHOTO_REGISTRY.cover.srcJpg}
                  alt={lang === 'vi' ? PHOTO_REGISTRY.cover.altVi : PHOTO_REGISTRY.cover.altEn}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                  }}
                />
              </picture>
            </div>

            {/* Guest Recipient Tag — Crisp, Bold, Solid Contrast */}
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.55rem 1.8rem',
                margin: '0.6rem 0',
                borderRadius: 'var(--radius-full)',
                background: '#FFFFFF',
                border: '1.5px solid #C9A063',
                boxShadow: '0 4px 16px rgba(73, 52, 58, 0.08)',
                maxWidth: '92%',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: '#9E6426',
                  fontWeight: 600,
                  marginBottom: '0.15rem',
                }}
              >
                {t.envelope.invitationFor}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.2rem, 3.6vw, 1.55rem)',
                  fontWeight: 700,
                  color: '#2E1810',
                  letterSpacing: '0.02em',
                  lineHeight: 1.25,
                  wordBreak: 'break-word',
                }}
              >
                {guestName || t.envelope.guestDefault}
              </span>
            </div>

            {/* Formal Wedding Announcement */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginBottom: '0.35rem',
                  fontWeight: 500,
                }}
              >
                {t.envelope.formalInvite}
              </p>

              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.85rem, 4.8vw, 2.5rem)',
                  fontWeight: 600,
                  color: 'var(--color-plum)',
                  letterSpacing: '0.03em',
                  lineHeight: 1.15,
                  margin: '0.25rem 0',
                }}
              >
                <span>{weddingConfig.couple.groom.shortName}</span>
                <span
                  style={{
                    display: 'inline-block',
                    margin: '0 0.5rem',
                    color: 'var(--color-rose)',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '0.9em',
                    fontWeight: 400,
                  }}
                >
                  &amp;
                </span>
                <span>{weddingConfig.couple.bride.shortName}</span>
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: 'var(--color-rose-dark)',
                  letterSpacing: '0.1em',
                  marginTop: '0.2rem',
                }}
              >
                {t.hero.weddingDate}
              </p>
            </div>

            {/* Interactive Open Action Button */}
            <div style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={handleOpenClick}
                disabled={animStage !== 'sealed'}
                aria-label={t.envelope.openBtn}
                className="magnetic-btn sheen-effect"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  padding: '0.85rem 2.2rem',
                  background: 'linear-gradient(135deg, #A84B5B 0%, #8C3947 50%, #6E2734 100%)',
                  color: '#FFFFFF',
                  border: '1.5px solid rgba(255, 235, 220, 0.5)',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  boxShadow: '0 8px 24px rgba(140, 57, 71, 0.45)',
                  cursor: animStage === 'sealed' ? 'pointer' : 'default',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isFlapOpen ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Sparkles size={17} style={{ color: '#EEDBC5' }} />
                <span>{t.envelope.openBtn}</span>
                <Heart size={15} fill="#FFFFFF" style={{ marginLeft: '2px' }} />
              </button>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.76rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '0.75rem',
                  fontStyle: 'italic',
                }}
              >
                {t.envelope.tapToOpen}
              </p>
            </div>
          </div>

          {/* 3. ENVELOPE POCKET FRONT (Layer that holds the card inside) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '42%',
              background: 'linear-gradient(180deg, rgba(255, 251, 249, 0.3) 0%, #F5ECE6 85%)',
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px',
              borderBottom: '2px solid #EEDBC5',
              borderLeft: '1.5px solid #EEDBC5',
              borderRight: '1.5px solid #EEDBC5',
              pointerEvents: 'none',
              zIndex: 3,
              boxShadow: 'inset 0 10px 20px rgba(73, 52, 58, 0.05)',
            }}
          />

          {/* 4. TOP 3D FOLDING FLAP WITH EMBOSSED WAX SEAL */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '30%',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              transform: isFlapOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
              transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: animStage === 'card-rising' || animStage === 'revealing-hero' ? 1 : 5,
              pointerEvents: animStage === 'sealed' ? 'auto' : 'none',
              cursor: 'pointer',
            }}
            onClick={handleOpenClick}
          >
            {/* Front of Flap (Triangle pointing down) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                background: 'linear-gradient(170deg, #FBF4EE 0%, #EDE1D7 100%)',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                boxShadow: '0 12px 28px rgba(47, 30, 36, 0.25)',
              }}
            >
              {/* Flap Gold Hairline Outline */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: 'polygon(4% 0, 96% 0, 50% 95%)',
                  border: '1px solid rgba(213, 181, 140, 0.5)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* ROYAL WAX SEAL WITH MONOGRAM N & H (Positioned at tip, outside clipPath so it's a complete circle) */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                zIndex: 6,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: animStage === 'sealed' ? 'auto' : 'none',
              }}
            >
              <div
                className="seal-pulse"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #B84758 0%, #8A2B3A 55%, #631C28 100%)',
                  border: '2px solid rgba(255, 235, 220, 0.45)',
                  boxShadow: '0 8px 22px rgba(138, 43, 58, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: animStage === 'sealed' ? 'translateY(50%) scale(1)' : 'translateY(50%) scale(1.25)',
                  opacity: animStage === 'sealed' ? 1 : 0,
                  cursor: 'pointer',
                  transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease',
                }}
              >
                {/* Monogram Seal Engraving */}
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    border: '1.5px dashed rgba(238, 219, 197, 0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#FFF2E2',
                      letterSpacing: '0.12em',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    N &amp; H
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.55rem',
                      color: '#EEDBC5',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    2026
                  </span>
                </div>
              </div>
            </div>

            {/* Backside of Flap (Revealed when opened 180 degrees) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: 'rotateX(180deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #EADBCF 0%, #D8C3B3 100%)',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '1px solid rgba(213, 181, 140, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(73, 52, 58, 0.4)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                }}
              >
                N&amp;H
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
