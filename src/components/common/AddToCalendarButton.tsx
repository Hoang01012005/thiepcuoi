import React, { useState, useRef, useEffect } from 'react';
import { type Language } from '../../config/translations';
import { weddingConfig } from '../../config/weddingConfig';
import { buildGoogleCalendarUrl, downloadICalFile } from '../../services/calendarUtils';
import { CalendarDays, Globe2, Apple, X } from 'lucide-react';

interface AddToCalendarButtonProps {
  lang: Language;
}

export const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const banquet = {
    titleVi: '💍 Tiệc Cưới Hoàng Nam & Ngọc Hiệp',
    titleEn: '💍 Wedding Banquet — Nam & Hiep',
    descVi: 'Tiệc cưới chung vui của Hoàng Nam & Ngọc Hiệp tại Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội. Kính mời quý khách đến chung vui!',
    descEn: 'Wedding Banquet of Hoang Nam & Ngoc Hiep at No. 11, Bao Loc 2, Phuc Loc, Hanoi. We warmly welcome your attendance!',
  };

  const ceremony = {
    titleVi: '🌸 Lễ Vu Quy — Hoàng Nam & Ngọc Hiệp',
    titleEn: '🌸 Wedding Ceremony — Nam & Hiep',
    descVi: 'Lễ vu quy của Hoàng Nam & Ngọc Hiệp. Nhà Gái: Số 11, Bảo Lộc 2, Phúc Lộc, Hà Nội.',
    descEn: 'Traditional wedding ceremony of Hoang Nam & Ngoc Hiep. Bride Home: No. 11, Bao Loc 2, Phuc Loc, Hanoi.',
  };

  const isVi = lang === 'vi';

  // Both events: banquet (28/11) and ceremony (29/11)
  const banquetEvent = {
    title: isVi ? banquet.titleVi : banquet.titleEn,
    description: isVi ? banquet.descVi : banquet.descEn,
    location: isVi ? weddingConfig.event.reception.addressVi : weddingConfig.event.reception.addressEn,
    startISO: weddingConfig.event.banquetDateISO || '2026-11-28T15:00:00+07:00',
    endISO: '2026-11-28T20:00:00+07:00',
  };

  const ceremonyEvent = {
    title: isVi ? ceremony.titleVi : ceremony.titleEn,
    description: isVi ? ceremony.descVi : ceremony.descEn,
    location: isVi ? weddingConfig.event.ceremony.addressVi : weddingConfig.event.ceremony.addressEn,
    startISO: weddingConfig.event.weddingDateISO,
    endISO: '2026-11-29T12:00:00+07:00',
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleGoogle = () => {
    window.open(buildGoogleCalendarUrl(banquetEvent), '_blank', 'noopener,noreferrer');
    window.open(buildGoogleCalendarUrl(ceremonyEvent), '_blank', 'noopener,noreferrer');
    setSaved(true);
    setIsOpen(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleIcal = () => {
    downloadICalFile(banquetEvent, 'cuoi-nam-hiep-tiec-cuoi.ics');
    setTimeout(() => downloadICalFile(ceremonyEvent, 'cuoi-nam-hiep-le-vu-quy.ics'), 400);
    setSaved(true);
    setIsOpen(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger Button */}
      <button
        type="button"
        id="add-to-calendar-btn"
        onClick={() => setIsOpen(v => !v)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.65rem 1.4rem',
          borderRadius: '9999px',
          background: saved
            ? 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)'
            : 'linear-gradient(135deg, #681122 0%, #4B0916 100%)',
          color: '#FFF9F0',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.86rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          border: '1.5px solid rgba(212,175,55,0.55)',
          boxShadow: '0 6px 20px rgba(58,5,16,0.25)',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          if (!saved) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 26px rgba(104,17,34,0.4)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(58,5,16,0.25)';
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <CalendarDays size={15} style={{ color: '#D4AF37' }} />
        <span>
          {saved
            ? (isVi ? '✓ Đã lưu vào lịch!' : '✓ Saved to calendar!')
            : (isVi ? 'Thêm vào lịch' : 'Add to Calendar')}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#FFFDFB',
            border: '1.5px solid rgba(212,175,55,0.5)',
            borderRadius: '16px',
            boxShadow: '0 16px 40px rgba(58,5,16,0.2), 0 0 0 1px rgba(212,175,55,0.15)',
            minWidth: '230px',
            overflow: 'hidden',
            zIndex: 500,
            animation: 'calMenuFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #681122 0%, #4B0916 100%)',
              padding: '0.7rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ color: '#FFF0C2', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
              {isVi ? 'Chọn ứng dụng lịch' : 'Choose calendar app'}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Options */}
          <div style={{ padding: '0.5rem' }}>
            <button
              type="button"
              role="menuitem"
              onClick={handleGoogle}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: '10px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                color: '#3A0510',
                fontWeight: 500,
                transition: 'background 0.15s ease',
                textAlign: 'left',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Globe2 size={18} style={{ color: '#4285F4', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600 }}>Google Calendar</div>
                <div style={{ fontSize: '0.74rem', color: '#84636C' }}>{isVi ? 'Mở trong trình duyệt' : 'Opens in browser'}</div>
              </div>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleIcal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: '10px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                color: '#3A0510',
                fontWeight: 500,
                transition: 'background 0.15s ease',
                textAlign: 'left',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Apple size={18} style={{ color: '#555', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600 }}>Apple / iCal</div>
                <div style={{ fontSize: '0.74rem', color: '#84636C' }}>{isVi ? 'Tải file .ics' : 'Download .ics file'}</div>
              </div>
            </button>
          </div>

          {/* Info note */}
          <div style={{ padding: '0.5rem 1.1rem 0.8rem', borderTop: '1px solid rgba(212,175,55,0.2)', marginTop: '0.25rem' }}>
            <p style={{ fontSize: '0.72rem', color: '#84636C', fontFamily: 'var(--font-sans)', lineHeight: 1.5 }}>
              {isVi ? '📅 Lưu cả 2 sự kiện: Tiệc 28/11 & Lễ 29/11' : '📅 Saves both: Banquet 28/11 & Ceremony 29/11'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
