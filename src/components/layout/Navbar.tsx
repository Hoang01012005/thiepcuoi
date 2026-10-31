import React from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { translations, type Language } from '../../config/translations';
import { Volume2, VolumeX, Globe } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  isPlaying: boolean;
  onToggleMusic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  isPlaying,
  onToggleMusic,
}) => {
  const t = translations[lang];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(250, 247, 240, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(198, 164, 106, 0.25)',
        padding: '0.75rem 1.25rem',
        boxShadow: '0 4px 20px rgba(64, 53, 47, 0.05)',
      }}
    >
      <div
        style={{
          maxWidth: '1140px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Monogram Brand */}
        <a
          href="#hero"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <img
            src={weddingConfig.couple.logo.src}
            alt={weddingConfig.couple.logo.alt}
            style={{
              width: '34px',
              height: '34px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 4px rgba(64, 53, 47, 0.15))',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--color-champagne-gold)',
              lineHeight: 1,
            }}
          >
            {weddingConfig.couple.monogram}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.88rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-deep-brown)',
              display: 'none',
            }}
            className="navbar-brand-text"
          >
            {weddingConfig.couple.groom.shortName} &amp; {weddingConfig.couple.bride.shortName}
          </span>
        </a>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Music Controller Button */}
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={isPlaying ? t.nav.musicPause : t.nav.musicPlay}
            title={isPlaying ? t.nav.musicPause : t.nav.musicPlay}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              background: isPlaying ? 'rgba(198, 164, 106, 0.18)' : 'rgba(255, 255, 255, 0.7)',
              border: isPlaying ? '1px solid var(--color-champagne-gold)' : '1px solid rgba(198, 164, 106, 0.3)',
              color: isPlaying ? 'var(--color-champagne-gold)' : 'var(--color-text-muted)',
              fontSize: '0.82rem',
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s ease',
            }}
          >
            {isPlaying ? (
              <>
                <Volume2 size={16} style={{ color: 'var(--color-champagne-gold)' }} />
                <span style={{ display: 'inline-block' }}>{t.nav.musicPause}</span>
                {/* 4-bar dynamic audio visualizer */}
                <div className="audio-visualizer is-playing" aria-hidden="true" style={{ marginLeft: '4px' }}>
                  <span className="audio-visualizer-bar" />
                  <span className="audio-visualizer-bar" />
                  <span className="audio-visualizer-bar" />
                  <span className="audio-visualizer-bar" />
                </div>
              </>
            ) : (
              <>
                <VolumeX size={16} />
                <span>{t.nav.musicPlay}</span>
              </>
            )}
          </button>

          {/* Bilingual Language Switcher */}
          <button
            type="button"
            onClick={onToggleLang}
            aria-label={t.nav.langAria}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--color-ivory) 0%, var(--color-warm-beige-light) 100%)',
              border: '1px solid var(--color-champagne-gold)',
              color: 'var(--color-deep-brown)',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.06em',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s ease',
            }}
          >
            <Globe size={15} style={{ color: 'var(--color-champagne-gold)' }} />
            <span>{t.nav.langSwitch}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
