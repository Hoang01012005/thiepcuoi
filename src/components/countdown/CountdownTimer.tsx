import React, { useEffect, useState } from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { translations, type Language } from '../../config/translations';
import { useCountdown } from '../../hooks/useCountdown';
import { SectionHeading } from '../common/SectionHeading';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { Heart } from 'lucide-react';
import { WeddingCalendar } from './WeddingCalendar';

interface CountdownTimerProps {
  lang: Language;
}

// Kinematic rolling number cell for smooth digit transitions
interface RollingDigitProps {
  value: number;
}

const RollingDigit: React.FC<RollingDigitProps> = ({ value }) => {
  const formatted = String(value).padStart(2, '0');
  const [currentVal, setCurrentVal] = useState(formatted);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (formatted !== currentVal) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setCurrentVal(formatted);
        setAnimating(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [formatted, currentVal]);

  return (
    <div
      style={{
        position: 'relative',
        height: 'clamp(2.6rem, 6vw, 4.4rem)',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        key={formatted}
        style={{
          display: 'block',
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
          fontWeight: 600,
          color: 'var(--color-rose-dark)',
          lineHeight: 1,
          letterSpacing: '0.02em',
          transform: animating ? 'translateY(-8px)' : 'translateY(0)',
          opacity: animating ? 0.75 : 1,
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
        }}
      >
        {formatted}
      </span>
    </div>
  );
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ lang }) => {
  const t = translations[lang];
  const { days, hours, minutes, seconds, isPassed } = useCountdown(weddingConfig.event.weddingDateISO);

  const units = [
    { label: t.countdown.days, value: days },
    { label: t.countdown.hours, value: hours },
    { label: t.countdown.minutes, value: minutes },
    { label: t.countdown.seconds, value: seconds },
  ];

  return (
    <section id="countdown" className="section-wrapper">
      <div className="container">
        <SectionHeading
          badge={t.countdown.badge}
          title={t.countdown.title}
          subtitle={t.countdown.subtitle}
        />

        {/* Wedding Calendar Widget with Heart Markings */}
        <WeddingCalendar lang={lang} />

        {isPassed ? (
          <div
            className="stationery-card"
            style={{
              maxWidth: '600px',
              margin: '2.5rem auto 0',
              textAlign: 'center',
              padding: '2.5rem',
            }}
          >
            <Heart size={32} style={{ color: 'var(--color-rose)', margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-plum)' }}>
              {t.countdown.eventPassed}
            </p>
          </div>
        ) : (
          <div
            className="stationery-card"
            style={{
              maxWidth: '840px',
              margin: '3rem auto 0',
              background: 'linear-gradient(150deg, rgba(255, 251, 249, 0.96) 0%, rgba(247, 239, 233, 0.9) 100%)',
              border: '1.5px solid rgba(213, 181, 140, 0.45)',
              borderRadius: '24px',
              padding: 'clamp(2rem, 4vw, 3.2rem) 1.5rem',
              boxShadow: 'var(--shadow-paper-lg)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Delicate Botanical Corner Flourishes */}
            <BotanicalCorner position="top-left" size={54} color="rgba(213, 181, 140, 0.5)" />
            <BotanicalCorner position="top-right" size={54} color="rgba(213, 181, 140, 0.5)" />

            {/* Inner Hairline Frame */}
            <div
              style={{
                position: 'absolute',
                inset: '8px',
                border: '1px solid rgba(213, 181, 140, 0.3)',
                borderRadius: '16px',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(0.5rem, 2.5vw, 2.5rem)',
                flexWrap: 'nowrap',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {units.map((unit, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                        color: 'var(--color-gold)',
                        opacity: 0.65,
                        userSelect: 'none',
                        transform: 'translateY(-12px)',
                      }}
                    >
                      :
                    </span>
                  )}

                  <div
                    style={{
                      textAlign: 'center',
                      minWidth: 'clamp(58px, 14vw, 96px)',
                      padding: '0.4rem',
                    }}
                  >
                    {/* Kinematic Rolling Digit */}
                    <RollingDigit value={unit.value} />

                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(0.72rem, 1.5vw, 0.82rem)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        color: 'var(--color-text-muted)',
                        marginTop: '0.5rem',
                      }}
                    >
                      {unit.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
