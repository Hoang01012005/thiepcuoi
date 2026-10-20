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
  // Animation states: 'closed' -> 'opening' -> 'revealing'
  const [animStage, setAnimStage] = useState<'closed' | 'opening' | 'revealing'>('closed');
  const guestName = useGuestName();
  const t = translations[lang];

  const handleOpenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (animStage !== 'closed') return;

    // Immediately trigger music on user click gesture
    onStartOpen?.();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 75,
        spread: 85,
        origin: { y: 0.5 },
        colors: ['#F3D5DA', '#C98291', '#D5B58C', '#FFF9F6', '#EEDBC5'],
      });
    } catch {}

    // Step 1: Double gatefold doors slide slowly and gracefully to left and right
    setAnimStage('opening');

    // Step 2: Overlay fades out and hands over to Hero after guests admire the inner card
    setTimeout(() => {
      setAnimStage('revealing');
    }, 3600);

    // Step 3: Complete handover & unmount
    setTimeout(() => {
      onOpen();
    }, 4800);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        backgroundColor: '#FAF2EC',
        backgroundImage: `
          radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.95) 0%, transparent 65%),
          radial-gradient(circle at 20% 80%, rgba(213, 181, 140, 0.25) 0%, transparent 55%),
          linear-gradient(180deg, #FFFDFB 0%, #FAF0EB 50%, #F3E5DC 100%)
        `,
        padding: '1.25rem',
        overflow: 'hidden',
        perspective: '1600px',
        transition: 'opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1), transform 1.2s ease',
        opacity: isRevealing ? 0 : 1,
        transform: isRevealing ? 'scale(1.04)' : 'scale(1)',
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
          zIndex: 60,
          background: 'rgba(255, 255, 255, 0.94)',
          border: '1.5px solid rgba(213, 181, 140, 0.7)',
          color: '#49343A',
          padding: '0.45rem 1.15rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          letterSpacing: '0.04em',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 14px rgba(73, 52, 58, 0.08)',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#FFFFFF')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.94)')}
      >
        {t.envelope.skipBtn} &rarr;
      </button>

      {/* Romantic Soft Garden Aura in Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${PHOTO_REGISTRY.hero.srcJpg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          filter: 'blur(22px) saturate(1.15)',
          opacity: 0.22,
          transform: 'scale(1.08)',
          pointerEvents: 'none',
        }}
      />

      {/* 3D GATEFOLD INVITATION ENVELOPE CONTAINER */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          height: 'clamp(490px, 80vh, 640px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ======================================================== */}
        {/* 1. INTERIOR WEDDING CARD (Revealed when doors open) */}
        {/* ======================================================== */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            background: 'linear-gradient(160deg, #FFFFFF 0%, #FFF9F6 50%, #FAF0EB 100%)',
            border: '2px solid rgba(213, 181, 140, 0.6)',
            boxShadow: '0 25px 60px rgba(73, 52, 58, 0.16)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
            overflow: 'hidden',
            zIndex: 10,
            transform: isOpening ? 'scale(1)' : 'scale(0.96)',
            transition: 'transform 3.2s cubic-bezier(0.19, 1, 0.22, 1)',
          }}
        >
          {/* Botanical Corners */}
          <BotanicalCorner position="top-left" size={54} color="rgba(213, 181, 140, 0.55)" />
          <BotanicalCorner position="top-right" size={54} color="rgba(213, 181, 140, 0.55)" />
          <BotanicalCorner position="bottom-left" size={54} color="rgba(213, 181, 140, 0.55)" />
          <BotanicalCorner position="bottom-right" size={54} color="rgba(213, 181, 140, 0.55)" />

          {/* Inner Hairline Frame */}
          <div
            style={{
              position: 'absolute',
              inset: '10px',
              border: '1px solid rgba(213, 181, 140, 0.35)',
              borderRadius: '16px',
              pointerEvents: 'none',
            }}
          />

          {/* Monogram */}
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: 'var(--color-rose-dark)',
              marginBottom: '0.5rem',
            }}
          >
            {weddingConfig.couple.monogram}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.78rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              color: 'var(--color-text-muted)',
              marginBottom: '1rem',
            }}
          >
            {t.envelope.formalInvite}
          </p>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.9rem, 4.5vw, 2.6rem)',
              color: 'var(--color-plum)',
              fontWeight: 600,
              lineHeight: 1.25,
              margin: '0 0 0.85rem',
            }}
          >
            {weddingConfig.couple.groom.shortName}
            <span style={{ display: 'block', fontSize: '0.9em', color: 'var(--color-rose)', margin: '0.2rem 0' }}>
              &amp;
            </span>
            {weddingConfig.couple.bride.shortName}
          </h2>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(213, 181, 140, 0.15)',
              border: '1px solid rgba(213, 181, 140, 0.45)',
              fontSize: '0.86rem',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: 'var(--color-plum)',
              marginTop: '0.5rem',
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--color-gold-dark)' }} />
            <span>28 &bull; 29 . 11 . 2026</span>
          </div>

          <p
            style={{
              marginTop: '1.25rem',
              fontSize: '0.85rem',
              color: 'var(--color-text-muted)',
              maxWidth: '360px',
              lineHeight: 1.6,
            }}
          >
            Sự hiện diện của bạn là niềm vinh hạnh và hạnh phúc lớn nhất của chúng tôi.
          </p>
        </div>

        {/* ======================================================== */}
        {/* 2. LEFT GATE PANEL (French Door - Slides to Left) */}
        {/* ======================================================== */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '50%',
            background: 'linear-gradient(135deg, #FFFDFB 0%, #FAF0EB 60%, #F5E6DC 100%)',
            borderTopLeftRadius: '24px',
            borderBottomLeftRadius: '24px',
            borderTop: '2px solid rgba(213, 181, 140, 0.65)',
            borderBottom: '2px solid rgba(213, 181, 140, 0.65)',
            borderLeft: '2px solid rgba(213, 181, 140, 0.65)',
            borderRight: '1.5px solid rgba(213, 181, 140, 0.5)',
            boxShadow: isOpening
              ? 'none'
              : '5px 0 20px rgba(73, 52, 58, 0.12), -5px 15px 35px rgba(73, 52, 58, 0.15)',
            zIndex: 30,
            overflow: 'hidden',
            transformOrigin: 'left center',
            transform: isOpening ? 'translateX(-115%) rotateY(-30deg)' : 'translateX(0) rotateY(0)',
            opacity: isOpening ? 0 : 1,
            transition: 'transform 3.2s cubic-bezier(0.19, 1, 0.22, 1), opacity 2.8s cubic-bezier(0.19, 1, 0.22, 1)',
            pointerEvents: isOpening ? 'none' : 'auto',
          }}
        >
          {/* Botanical Corners on Left Door */}
          <BotanicalCorner position="top-left" size={48} color="rgba(213, 181, 140, 0.5)" />
          <BotanicalCorner position="bottom-left" size={48} color="rgba(213, 181, 140, 0.5)" />

          {/* Gold Foil Border Inset */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              bottom: '12px',
              left: '12px',
              right: '6px',
              borderTop: '1px solid rgba(213, 181, 140, 0.4)',
              borderBottom: '1px solid rgba(213, 181, 140, 0.4)',
              borderLeft: '1px solid rgba(213, 181, 140, 0.4)',
              borderRight: 'none',
              borderTopLeftRadius: '14px',
              borderBottomLeftRadius: '14px',
              pointerEvents: 'none',
            }}
          />

          {/* Left Ribbon Half */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '42px',
              transform: 'translateY(-50%)',
              background: 'linear-gradient(180deg, rgba(201, 130, 145, 0.28) 0%, rgba(155, 56, 72, 0.38) 100%)',
              borderTop: '1px solid rgba(213, 181, 140, 0.6)',
              borderBottom: '1px solid rgba(213, 181, 140, 0.6)',
            }}
          />

          {/* Left Door Monogram Letter */}
          <div
            style={{
              position: 'absolute',
              top: '22%',
              right: '18px',
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              color: 'rgba(201, 130, 145, 0.35)',
              fontWeight: 700,
              userSelect: 'none',
            }}
          >
            N
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. RIGHT GATE PANEL (French Door - Slides to Right) */}
        {/* ======================================================== */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '50%',
            background: 'linear-gradient(225deg, #FFFDFB 0%, #FAF0EB 60%, #F5E6DC 100%)',
            borderTopRightRadius: '24px',
            borderBottomRightRadius: '24px',
            borderTop: '2px solid rgba(213, 181, 140, 0.65)',
            borderBottom: '2px solid rgba(213, 181, 140, 0.65)',
            borderRight: '2px solid rgba(213, 181, 140, 0.65)',
            borderLeft: '1.5px solid rgba(213, 181, 140, 0.5)',
            boxShadow: isOpening
              ? 'none'
              : '-5px 0 20px rgba(73, 52, 58, 0.12), 5px 15px 35px rgba(73, 52, 58, 0.15)',
            zIndex: 30,
            overflow: 'hidden',
            transformOrigin: 'right center',
            transform: isOpening ? 'translateX(115%) rotateY(30deg)' : 'translateX(0) rotateY(0)',
            opacity: isOpening ? 0 : 1,
            transition: 'transform 3.2s cubic-bezier(0.19, 1, 0.22, 1), opacity 2.8s cubic-bezier(0.19, 1, 0.22, 1)',
            pointerEvents: isOpening ? 'none' : 'auto',
          }}
        >
          {/* Botanical Corners on Right Door */}
          <BotanicalCorner position="top-right" size={48} color="rgba(213, 181, 140, 0.5)" />
          <BotanicalCorner position="bottom-right" size={48} color="rgba(213, 181, 140, 0.5)" />

          {/* Gold Foil Border Inset */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              bottom: '12px',
              left: '6px',
              right: '12px',
              borderTop: '1px solid rgba(213, 181, 140, 0.4)',
              borderBottom: '1px solid rgba(213, 181, 140, 0.4)',
              borderRight: '1px solid rgba(213, 181, 140, 0.4)',
              borderLeft: 'none',
              borderTopRightRadius: '14px',
              borderBottomRightRadius: '14px',
              pointerEvents: 'none',
            }}
          />

          {/* Right Ribbon Half */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '42px',
              transform: 'translateY(-50%)',
              background: 'linear-gradient(180deg, rgba(201, 130, 145, 0.28) 0%, rgba(155, 56, 72, 0.38) 100%)',
              borderTop: '1px solid rgba(213, 181, 140, 0.6)',
              borderBottom: '1px solid rgba(213, 181, 140, 0.6)',
            }}
          />

          {/* Right Door Monogram Letter */}
          <div
            style={{
              position: 'absolute',
              top: '22%',
              left: '18px',
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              color: 'rgba(201, 130, 145, 0.35)',
              fontWeight: 700,
              userSelect: 'none',
            }}
          >
            H
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. CENTER SEAM WAX SEAL & GUEST INVITATION TAG */}
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
            transition: 'opacity 1.5s ease, transform 1.8s cubic-bezier(0.19, 1, 0.22, 1)',
            opacity: isOpening ? 0 : 1,
            transform: isOpening ? 'translate(-50%, -50%) scale(1.3)' : 'translate(-50%, -50%) scale(1)',
            pointerEvents: isOpening ? 'none' : 'auto',
          }}
        >
          {/* Guest Name Invitation Badge above seal */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.96)',
              padding: '0.45rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid rgba(213, 181, 140, 0.7)',
              boxShadow: '0 8px 24px rgba(73, 52, 58, 0.12)',
              marginBottom: '1rem',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              maxWidth: '320px',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
              }}
            >
              {t.envelope.invitationFor}
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--color-plum)',
                letterSpacing: '0.02em',
                marginTop: '1px',
              }}
            >
              {guestName || t.envelope.guestDefault}
            </span>
          </div>

          {/* Royal Wax Seal Button */}
          <div
            className="seal-pulse"
            style={{
              position: 'relative',
              width: 'clamp(84px, 18vw, 104px)',
              height: 'clamp(84px, 18vw, 104px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #D95D74 0%, #A63B4F 60%, #6E2031 100%)',
              border: '3px solid rgba(255, 235, 220, 0.55)',
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
            {/* Wax Edge Texture */}
            <div
              style={{
                position: 'absolute',
                inset: '-3px',
                borderRadius: '50%',
                border: '1.5px dashed rgba(213, 181, 140, 0.45)',
                pointerEvents: 'none',
              }}
            />

            {/* Monogram Seal Inscription */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#FFEEDD',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                }}
              >
                {weddingConfig.couple.monogram}
              </div>
            </div>
          </div>

          {/* Glow Action Button */}
          <button
            type="button"
            onClick={handleOpenClick}
            style={{
              marginTop: '1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.65rem 1.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--color-rose) 0%, var(--color-rose-dark) 100%)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              boxShadow: '0 6px 20px rgba(201, 130, 145, 0.5)',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Heart size={15} style={{ fill: 'currentColor' }} />
            <span>{t.envelope.openBtn}</span>
          </button>

          <span
            style={{
              marginTop: '0.65rem',
              fontSize: '0.74rem',
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.04em',
            }}
          >
            {t.envelope.tapToOpen}
          </span>
        </div>
      </div>
    </div>
  );
};
