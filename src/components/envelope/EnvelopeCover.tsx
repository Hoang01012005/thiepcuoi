import React, { useState } from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { PHOTO_REGISTRY } from '../../config/photos';
import { translations, type Language } from '../../config/translations';
import { useGuestName } from '../../hooks/useGuestName';
import { BotanicalCorner } from '../common/BotanicalCorners';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';

interface EnvelopeCoverProps {
  lang: Language;
  onStartOpen?: () => void;
  onOpen: () => void;
}

export const EnvelopeCover: React.FC<EnvelopeCoverProps> = ({ lang, onStartOpen, onOpen }) => {
  // Animation progression: 'closed' -> 'opening' -> 'revealing'
  const [animStage, setAnimStage] = useState<'closed' | 'opening' | 'revealing'>('closed');
  const guestName = useGuestName();
  const t = translations[lang];

  const handleOpenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (animStage !== 'closed') return;

    // Immediately trigger music on primary user click gesture
    onStartOpen?.();

    // Trigger celebratory champagne gold & white orchid confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.52 },
        colors: ['#C6A46A', '#E8DFD2', '#FAF7F0', '#C99A9A', '#FFFFFF'],
        disableForReducedMotion: true,
      });
    } catch {}

    // Step 1: Flap flips 3D upward, card slides up
    setAnimStage('opening');

    // Step 2: Overlay fades softly and hands over to Hero after guest views the card
    setTimeout(() => {
      setAnimStage('revealing');
    }, 3800);

    // Step 3: Complete handover & unmount
    setTimeout(() => {
      onOpen();
    }, 4900);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartOpen?.();
    onOpen();
  };

  const isOpening = animStage === 'opening' || animStage === 'revealing';
  const isRevealing = animStage === 'revealing';

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
        backgroundColor: '#FAF7F0',
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.98) 0%, transparent 70%),
          radial-gradient(circle at 15% 85%, rgba(198, 164, 106, 0.22) 0%, transparent 50%),
          radial-gradient(circle at 85% 15%, rgba(201, 154, 154, 0.16) 0%, transparent 45%),
          linear-gradient(180deg, #FFFDF9 0%, #FAF7F0 50%, #E8DFD2 100%)
        `,
        padding: '1.25rem',
        overflow: 'hidden',
        transition: 'opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1), transform 1.2s ease',
        opacity: isRevealing ? 0 : 1,
        transform: isRevealing ? 'scale(1.05)' : 'scale(1)',
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
          zIndex: 70,
          background: 'rgba(250, 247, 240, 0.92)',
          border: '1.5px solid rgba(198, 164, 106, 0.65)',
          color: '#40352F',
          padding: '0.45rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          letterSpacing: '0.04em',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 16px rgba(64, 53, 47, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#FFFFFF';
          e.currentTarget.style.borderColor = 'rgba(198, 164, 106, 0.9)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(198, 164, 106, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(250, 247, 240, 0.92)';
          e.currentTarget.style.borderColor = 'rgba(198, 164, 106, 0.65)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(64, 53, 47, 0.1)';
        }}
      >
        {t.envelope.skipBtn} &rarr;
      </button>

      {/* Cinematic Ambient Background Portrait Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${PHOTO_REGISTRY.cover.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          filter: 'blur(30px) saturate(1.15)',
          opacity: 0.16,
          transform: 'scale(1.1)',
          pointerEvents: 'none',
        }}
      />

      {/* ======================================================== */}
      {/* 3D ROYAL LUXURY WEDDING ENVELOPE STAGE */}
      {/* ======================================================== */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          height: 'clamp(360px, 60vw, 420px)',
          perspective: '1400px',
          WebkitPerspective: '1400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: isOpening ? 'clamp(6rem, 16vh, 9.5rem)' : '0',
          transition: 'margin-top 1.8s cubic-bezier(0.19, 1, 0.22, 1)',
        }}
      >
        {/* Envelope 3D Box Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
          }}
        >
          {/* 1. ENVELOPE BACK PLATE (Royal Deep Brown & Mahogany Lining) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '16px',
              background: 'linear-gradient(150deg, #40352F 0%, #502B32 45%, #6E323D 100%)',
              border: '1.5px solid rgba(198, 164, 106, 0.5)',
              boxShadow: isOpening
                ? '0 30px 70px rgba(64, 53, 47, 0.35)'
                : '0 25px 60px rgba(64, 53, 47, 0.28), 0 0 0 1px rgba(198, 164, 106, 0.3)',
              overflow: 'hidden',
              zIndex: 5,
            }}
          >
            {/* Interior Silk Damask Watermark */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.08,
                backgroundImage: `radial-gradient(circle, #C6A46A 1.5px, transparent 1.5px)`,
                backgroundSize: '24px 24px',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* 2. INNER STATIONERY INVITATION CARD (Slides out high above flaps) */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '12px',
              width: '92%',
              height: '95%',
              borderRadius: '14px',
              background: 'linear-gradient(165deg, #FFFFFF 0%, #FAF7F0 55%, #E8DFD2 100%)',
              border: '1.5px solid rgba(198, 164, 106, 0.65)',
              boxShadow: isOpening
                ? '0 30px 65px rgba(64, 53, 47, 0.22), 0 0 0 1px rgba(198, 164, 106, 0.45)'
                : '0 8px 20px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 'clamp(0.95rem, 2.5vw, 1.5rem) clamp(0.75rem, 2vw, 1.4rem)',
              zIndex: 15,
              transform: isOpening
                ? 'translate(-50%, -66%) scale(1.02)'
                : 'translate(-50%, 0%) scale(0.96)',
              transition: 'transform 2.2s cubic-bezier(0.19, 1, 0.22, 1) 0.35s, box-shadow 1.5s ease',
              overflow: 'hidden',
              pointerEvents: isOpening ? 'auto' : 'none',
            }}
          >
            {/* White Orchid & Champagne Botanical Corners */}
            <BotanicalCorner position="top-left" size={44} variant="white-orchid" />
            <BotanicalCorner position="top-right" size={44} variant="white-orchid" />
            <BotanicalCorner position="bottom-left" size={44} variant="white-orchid" />
            <BotanicalCorner position="bottom-right" size={44} variant="white-orchid" />

            {/* Inner Gold Foil Hairline Frame */}
            <div
              style={{
                position: 'absolute',
                inset: '7px',
                border: '1px solid rgba(198, 164, 106, 0.38)',
                borderRadius: '10px',
                pointerEvents: 'none',
              }}
            />

            {/* Official Floral Monogram Logo on Slide Card - Perfectly Straight & Upright */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.45rem',
                transform: 'none',
              }}
            >
              <img
                src={weddingConfig.couple.logo.src}
                alt={weddingConfig.couple.logo.alt}
                style={{
                  width: 'clamp(66px, 12vw, 82px)',
                  height: 'clamp(66px, 12vw, 82px)',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 6px rgba(64, 53, 47, 0.16))',
                  transform: 'none',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </div>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: '#A67575',
                marginBottom: '0.5rem',
              }}
            >
              {t.envelope.formalInvite}
            </p>

            {/* Real Couple Photo Accent Window - Tall Oval Frame with Face Focus */}
            <div
              style={{
                width: 'clamp(82px, 17vw, 102px)',
                height: 'clamp(104px, 22vw, 126px)',
                borderRadius: 'var(--radius-full)',
                padding: '3px',
                background: 'linear-gradient(135deg, #FAF7F0 0%, #C6A46A 50%, #9F7E46 100%)',
                boxShadow: '0 6px 18px rgba(64, 53, 47, 0.16)',
                marginBottom: '0.55rem',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src={PHOTO_REGISTRY.cover.src}
                alt={PHOTO_REGISTRY.cover.altVi}
                width={PHOTO_REGISTRY.cover.width}
                height={PHOTO_REGISTRY.cover.height}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>

            {/* Couple Names - Responsive 2-line auto wrapping */}
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.2rem, 3.8vw, 1.85rem)',
                color: '#40352F',
                fontWeight: 700,
                lineHeight: 1.25,
                margin: '0 0 0.4rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem 0.45rem',
                maxWidth: '100%',
              }}
            >
              <span style={{ whiteSpace: 'nowrap' }}>{weddingConfig.couple.groom.shortName}</span>
              <span
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: '1.25em',
                  color: '#C99A9A',
                  fontWeight: 400,
                  display: 'inline-block',
                }}
              >
                &amp;
              </span>
              <span style={{ whiteSpace: 'nowrap' }}>{weddingConfig.couple.bride.shortName}</span>
            </h2>

            {/* Wedding Date Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.25rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(198, 164, 106, 0.12)',
                border: '1px solid rgba(198, 164, 106, 0.45)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-serif)',
                color: '#40352F',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              <Sparkles size={12} style={{ color: '#C6A46A' }} />
              <span>28 &bull; 29 . 11 . 2026</span>
            </div>

            <p
              style={{
                marginTop: '0.55rem',
                fontSize: '0.78rem',
                color: '#7A6960',
                maxWidth: '340px',
                lineHeight: 1.5,
              }}
            >
              {lang === 'vi'
                ? 'Sự hiện diện của Quý vị là niềm vinh hạnh và hạnh phúc lớn nhất của chúng tôi.'
                : 'Your presence would bring the greatest joy and honor to our celebration.'}
            </p>
          </div>

          {/* 3. ENVELOPE LEFT FOLD TRIANGLE (Lowered peak to 68% so card is not covered) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: 'polygon(0 0, 0 100%, 50% 68%)',
              background: 'linear-gradient(135deg, #4A3E37 0%, #3B302A 100%)',
              zIndex: 20,
              filter: 'drop-shadow(2px 0 6px rgba(0, 0, 0, 0.22))',
              pointerEvents: 'none',
            }}
          />

          {/* 4. ENVELOPE RIGHT FOLD TRIANGLE (Lowered peak to 68% so card is not covered) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: 'polygon(100% 0, 100% 100%, 50% 68%)',
              background: 'linear-gradient(225deg, #4A3E37 0%, #3B302A 100%)',
              zIndex: 20,
              filter: 'drop-shadow(-2px 0 6px rgba(0, 0, 0, 0.22))',
              pointerEvents: 'none',
            }}
          />

          {/* 5. ENVELOPE BOTTOM FOLD TRIANGLE (Lowered peak to 68% so all text is crystal clear) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: 'polygon(0 100%, 100% 100%, 50% 68%)',
              background: 'linear-gradient(180deg, #5C4D44 0%, #40352F 100%)',
              zIndex: 22,
              filter: 'drop-shadow(0 -3px 8px rgba(0, 0, 0, 0.25))',
              pointerEvents: 'none',
            }}
          >
            {/* Subtle Gold Hairline along bottom triangle seam */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <line x1="0" y1="100" x2="50" y2="68" stroke="rgba(198, 164, 106, 0.45)" strokeWidth="0.8" />
              <line x1="100" y1="100" x2="50" y2="68" stroke="rgba(198, 164, 106, 0.45)" strokeWidth="0.8" />
            </svg>
          </div>

          {/* 6. ENVELOPE TOP FLAP (3D Open Transform) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '56%',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              background: isOpening
                ? 'linear-gradient(180deg, #3B302A 0%, #2A221E 100%)'
                : 'linear-gradient(180deg, #6E5346 0%, #504037 100%)',
              borderTop: '1.5px solid rgba(198, 164, 106, 0.55)',
              zIndex: isOpening ? 8 : 28,
              transform: isOpening ? 'rotateX(-180deg)' : 'rotateX(0deg)',
              transition: 'transform 1.4s cubic-bezier(0.4, 0, 0.2, 1), z-index 0s 0.35s',
              filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))',
              pointerEvents: isOpening ? 'none' : 'auto',
            }}
          >
            {/* Gold Seam Lining on Top Flap */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <line x1="0" y1="0" x2="50" y2="100" stroke="rgba(198, 164, 106, 0.5)" strokeWidth="0.9" />
              <line x1="100" y1="0" x2="50" y2="100" stroke="rgba(198, 164, 106, 0.5)" strokeWidth="0.9" />
            </svg>
          </div>

          {/* ======================================================== */}
          {/* 7. ROYAL CHAMPAGNE GOLD WAX SEAL & GUEST TAG */}
          {/* ======================================================== */}
          <div
            onClick={handleOpenClick}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'opacity 1.2s ease, transform 1.4s cubic-bezier(0.19, 1, 0.22, 1)',
              opacity: isOpening ? 0 : 1,
              transform: isOpening
                ? 'translate(-50%, -50%) scale(1.35)'
                : 'translate(-50%, -50%) scale(1)',
              pointerEvents: isOpening ? 'none' : 'auto',
            }}
          >
            {/* Personalized Guest Badge */}
            <div
              className="gold-foil-badge"
              style={{
                padding: '0.42rem 1.35rem',
                borderRadius: 'var(--radius-full)',
                marginBottom: '0.85rem',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                maxWidth: '320px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#A67575',
                }}
              >
                {t.envelope.invitationFor}
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: '#40352F',
                  letterSpacing: '0.02em',
                  marginTop: '1px',
                }}
              >
                {guestName || t.envelope.guestDefault}
              </span>
            </div>

            {/* Champagne Gold Wax Seal Button */}
            <div
              className="seal-pulse-gold"
              style={{
                position: 'relative',
                width: 'clamp(84px, 17vw, 102px)',
                height: 'clamp(84px, 17vw, 102px)',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 32%, #FAF7F0 0%, #C6A46A 42%, #9F7E46 75%, #5C4518 100%)',
                border: '3px solid rgba(250, 247, 240, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'transform 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {/* Outer Scalloped Edge Effect */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-4px',
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(250, 247, 240, 0.7)',
                  pointerEvents: 'none',
                }}
              />

              {/* Embossed Authentic Floral Monogram Logo N & H */}
              <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={weddingConfig.couple.logo.src}
                  alt={weddingConfig.couple.logo.alt}
                  style={{
                    width: 'clamp(70px, 14vw, 86px)',
                    height: 'clamp(70px, 14vw, 86px)',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 5px rgba(64, 53, 47, 0.5))',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    transform: 'none',
                  }}
                />
              </div>
            </div>

            {/* "Mở Thiệp / Open" CTA Button */}
            <button
              type="button"
              onClick={handleOpenClick}
              style={{
                marginTop: '1.1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.6rem',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #C6A46A 0%, #9F7E46 100%)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                border: '1px solid rgba(250, 247, 240, 0.65)',
                boxShadow: '0 6px 22px rgba(64, 53, 47, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 26px rgba(198, 164, 106, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 22px rgba(64, 53, 47, 0.3)';
              }}
            >
              <Heart size={15} style={{ fill: '#FFFFFF', color: '#FFFFFF' }} />
              <span>{t.envelope.openBtn}</span>
            </button>

            <span
              style={{
                marginTop: '0.55rem',
                fontSize: '0.74rem',
                color: '#7A6960',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.04em',
              }}
            >
              {t.envelope.tapToOpen}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
