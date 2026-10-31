import React from 'react';
import { type Language } from '../../config/translations';
import { Heart, Sparkles, Calendar as CalendarIcon } from 'lucide-react';

interface WeddingCalendarProps {
  lang: Language;
}

export const WeddingCalendar: React.FC<WeddingCalendarProps> = ({ lang }) => {
  // Days of week headers (Monday to Sunday)
  const weekdaysVi = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const weekdaysEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekdays = lang === 'vi' ? weekdaysVi : weekdaysEn;

  // November 2026: Nov 1 is Sunday (index 6, 0-indexed Mon-Sun)
  // Grid cells: 6 empty cells before day 1
  const emptyLeadingCells = 6;
  const totalDays = 30; // November has 30 days

  const calendarDays: Array<number | null> = [
    ...Array(emptyLeadingCells).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  return (
    <div
      style={{
        maxWidth: '560px',
        margin: '0 auto 2.5rem',
        background: 'linear-gradient(145deg, #FFFFFF 0%, #FAF7F0 50%, #E8DFD2 100%)',
        borderRadius: '24px',
        padding: 'clamp(1.5rem, 4vw, 2.25rem) clamp(1rem, 3.5vw, 2rem)',
        border: '1.5px solid rgba(198, 164, 106, 0.55)',
        boxShadow: '0 16px 40px rgba(64, 53, 47, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.25rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(198, 164, 106, 0.16)',
            border: '1px solid rgba(198, 164, 106, 0.45)',
            fontSize: '0.74rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-rose-dark)',
            marginBottom: '0.65rem',
          }}
        >
          <CalendarIcon size={12} />
          <span>Save The Date</span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.6rem, 3.8vw, 2.1rem)',
            color: 'var(--color-plum)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            margin: '0 0 0.35rem',
          }}
        >
          {lang === 'vi' ? 'THÁNG 11 / 2026' : 'NOVEMBER 2026'}
        </h3>

        <p
          style={{
            fontSize: '0.85rem',
            fontStyle: 'italic',
            fontFamily: 'var(--font-serif)',
            color: 'var(--color-rose-dark)',
            margin: 0,
            opacity: 0.9,
          }}
        >
          {lang === 'vi' ? 'Tháng Mười Năm Bính Ngọ (Âm Lịch)' : '10th Lunar Month of the Horse'}
        </p>
      </div>

      {/* Weekdays Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.35rem',
          textAlign: 'center',
          marginBottom: '0.85rem',
          borderBottom: '1px solid rgba(198, 164, 106, 0.35)',
          paddingBottom: '0.65rem',
        }}
      >
        {weekdays.map((day, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.05em',
              color: idx >= 5 ? 'var(--color-rose-dark)' : 'var(--color-plum)',
              opacity: idx >= 5 ? 1 : 0.75,
            }}
          >
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 'clamp(0.2rem, 1vw, 0.45rem)',
          textAlign: 'center',
        }}
      >
        {calendarDays.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`} style={{ minHeight: '44px' }} />;
          }

          const isDay28 = day === 28; // Tiệc Cưới Chung Vui
          const isDay29 = day === 29; // Lễ Vu Quy

          return (
            <div
              key={`day-${day}`}
              style={{
                position: 'relative',
                minHeight: 'clamp(42px, 8vw, 54px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isDay29 ? (
                // DAY 29: MAIN WEDDING CEREMONY HEART BADGE
                <div
                  style={{
                    position: 'relative',
                    width: 'clamp(38px, 7.5vw, 48px)',
                    height: 'clamp(38px, 7.5vw, 48px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Pulsing Decorative Heart Outline SVG */}
                  <svg
                    viewBox="0 0 100 90"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      fill: 'rgba(201, 154, 154, 0.2)',
                      stroke: 'var(--color-rose-dark)',
                      strokeWidth: 4,
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      animation: 'sealPulse 2.4s ease-in-out infinite',
                      filter: 'drop-shadow(0 3px 8px rgba(201, 154, 154, 0.4))',
                    }}
                  >
                    <path d="M 50,85 C 10,55 0,30 15,12 C 30,-5 45,5 50,18 C 55,5 70,-5 85,12 C 100,30 90,55 50,85 Z" />
                  </svg>

                  <span
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                      fontWeight: 700,
                      color: 'var(--color-rose-dark)',
                      marginTop: '4px',
                    }}
                  >
                    29
                  </span>

                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-12px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.62rem',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                      color: 'var(--color-rose-dark)',
                      letterSpacing: '0.04em',
                      background: 'rgba(250, 247, 240, 0.95)',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(201, 154, 154, 0.3)',
                      zIndex: 3,
                    }}
                  >
                    {lang === 'vi' ? 'Lễ Vu Quy' : 'Ceremony'}
                  </span>
                </div>
              ) : isDay28 ? (
                // DAY 28: WEDDING BANQUET BADGE
                <div
                  style={{
                    position: 'relative',
                    width: 'clamp(38px, 7.5vw, 48px)',
                    height: 'clamp(38px, 7.5vw, 48px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    viewBox="0 0 100 90"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      fill: 'rgba(198, 164, 106, 0.22)',
                      stroke: 'var(--color-gold-dark)',
                      strokeWidth: 3.5,
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                    }}
                  >
                    <path d="M 50,85 C 10,55 0,30 15,12 C 30,-5 45,5 50,18 C 55,5 70,-5 85,12 C 100,30 90,55 50,85 Z" />
                  </svg>

                  <span
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                      fontWeight: 700,
                      color: 'var(--color-gold-dark)',
                      marginTop: '4px',
                    }}
                  >
                    28
                  </span>

                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-12px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.62rem',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                      color: 'var(--color-gold-dark)',
                      letterSpacing: '0.04em',
                      background: 'rgba(250, 247, 240, 0.95)',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      border: '1px solid rgba(198, 164, 106, 0.3)',
                      zIndex: 3,
                    }}
                  >
                    {lang === 'vi' ? 'Tiệc Cưới' : 'Banquet'}
                  </span>
                </div>
              ) : (
                // Regular Day Number
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
                    fontWeight: idx % 7 >= 5 ? 600 : 400,
                    color: idx % 7 >= 5 ? 'var(--color-plum)' : 'var(--color-text-muted)',
                    opacity: idx % 7 >= 5 ? 0.9 : 0.7,
                  }}
                >
                  {day}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Event Details Tags below calendar */}
      <div
        style={{
          marginTop: '2.2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(198, 164, 106, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(198, 164, 106, 0.12)',
            padding: '0.55rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--color-gold)',
            fontSize: '0.84rem',
            color: 'var(--color-plum)',
          }}
        >
          <Heart size={14} style={{ color: 'var(--color-gold-dark)', flexShrink: 0 }} />
          <span>
            <strong>{lang === 'vi' ? 'Thứ Bảy, 28/11/2026' : 'Saturday, Nov 28, 2026'}:</strong>{' '}
            15:00 &mdash; {lang === 'vi' ? 'Tiệc Cưới Chung Vui (Nhà Gái)' : 'Banquet (Bride Residence)'}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(201, 154, 154, 0.22)',
            padding: '0.55rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--color-rose-dark)',
            fontSize: '0.84rem',
            color: 'var(--color-plum)',
          }}
        >
          <Sparkles size={14} style={{ color: 'var(--color-rose-dark)', flexShrink: 0 }} />
          <span>
            <strong>{lang === 'vi' ? 'Chủ Nhật, 29/11/2026' : 'Sunday, Nov 29, 2026'}:</strong>{' '}
            09:00 &mdash; {lang === 'vi' ? 'Lễ Vu Quy (Nhà Gái & Nhà Trai)' : 'Marriage Ceremony'}
          </span>
        </div>
      </div>
    </div>
  );
};
