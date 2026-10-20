import React, { useState } from 'react';
import { useGuestManager } from '../../hooks/useGuestName';
import { Sparkles, Copy, Check, X, RefreshCw, UserCheck } from 'lucide-react';

interface GuestCustomizerModalProps {
  onResetEnvelope?: () => void;
}

const HONORIFIC_CHIPS = ['Anh', 'Chị', 'Em', 'Bạn', 'Gia đình', 'Cô Chú', 'Bác'];

export const GuestCustomizerModal: React.FC<GuestCustomizerModalProps> = ({ onResetEnvelope }) => {
  const { guestName, setGuestName, copyInvitationLink, isCopied } = useGuestManager();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(guestName || '');

  // Synchronize input when opened
  const handleOpen = () => {
    setInputValue(guestName || '');
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setGuestName(val.trim() ? val : null);
  };

  const handleChipClick = (chip: string) => {
    let newVal = inputValue.trim();
    if (!newVal) {
      newVal = chip + ' ';
    } else if (!newVal.startsWith(chip)) {
      newVal = `${chip} ${newVal}`;
    }
    setInputValue(newVal);
    setGuestName(newVal.trim() ? newVal : null);
  };

  const handleClear = () => {
    setInputValue('');
    setGuestName(null);
  };

  const handleReopenEnvelope = () => {
    sessionStorage.removeItem('wedding_opened');
    if (onResetEnvelope) {
      onResetEnvelope();
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <aside
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 998,
        }}
        aria-label="Cài đặt tên khách mời"
      >
        <button
          type="button"
          onClick={handleOpen}
          title="Đổi tên khách mời & Tạo link thiệp riêng"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.15rem',
            background: 'linear-gradient(135deg, #FFF9F6 0%, #F5ECE6 100%)',
            border: '1.5px solid #D5B58C',
            borderRadius: 'var(--radius-full)',
            color: 'var(--color-plum)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 6px 20px rgba(73, 52, 58, 0.15)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(201, 130, 145, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(73, 52, 58, 0.15)';
          }}
        >
          <Sparkles size={16} style={{ color: 'var(--color-gold-dark)', flexShrink: 0 }} />
          <span>{guestName ? `Khách: ${guestName}` : 'Đổi Tên Khách Mời'}</span>
        </button>
      </aside>

      {/* Settings Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            background: 'rgba(40, 25, 30, 0.55)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.25s ease',
          }}
          onClick={handleClose}
        >
          <div
            className="stationery-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: 'clamp(1.75rem, 5vw, 2.5rem)',
              background: '#FFF9F6',
              boxShadow: '0 20px 50px rgba(73, 52, 58, 0.3)',
              position: 'relative',
              animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(213, 181, 140, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-plum)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201, 130, 145, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(213, 181, 140, 0.2)')}
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(213, 181, 140, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold-dark)',
                }}
              >
                <UserCheck size={20} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.45rem',
                    color: 'var(--color-plum)',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Cá Nhân Hóa Tên Khách Mời
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0' }}>
                  Đổi tên người nhận trên thiệp & tạo link gửi riêng
                </p>
              </div>
            </div>

            {/* Quick Honorific Chips */}
            <div style={{ margin: '1.25rem 0 0.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: 'var(--color-text-muted)',
                  marginBottom: '0.4rem',
                  textTransform: 'uppercase',
                }}
              >
                Gợi ý xưng hô nhanh:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {HONORIFIC_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    style={{
                      padding: '0.25rem 0.65rem',
                      background: 'rgba(255, 255, 255, 0.85)',
                      border: '1px solid rgba(213, 181, 140, 0.45)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      color: 'var(--color-plum)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-rose)';
                      e.currentTarget.style.background = 'rgba(243, 213, 218, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(213, 181, 140, 0.45)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                    }}
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Field */}
            <div style={{ margin: '1rem 0 1.25rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  placeholder="Nhập tên khách (ví dụ: Anh Hoàng, Gia Đình Bác Hùng...)"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    paddingRight: inputValue ? '2.5rem' : '1rem',
                    background: '#FFFFFF',
                    border: '1.5px solid #D5B58C',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.98rem',
                    color: 'var(--color-plum)',
                    outline: 'none',
                    boxShadow: 'inset 0 1px 3px rgba(73, 52, 58, 0.05)',
                  }}
                  autoFocus
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                    }}
                    title="Xóa tên"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Live Preview Badge */}
            <div
              style={{
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(213, 181, 140, 0.15) 0%, rgba(243, 213, 218, 0.22) 100%)',
                border: '1px solid rgba(213, 181, 140, 0.45)',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold-dark)',
                  fontWeight: 600,
                  marginBottom: '0.2rem',
                }}
              >
                Hiển thị trên thiệp mời:
              </span>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--color-plum)',
                }}
              >
                Kính gửi: <strong style={{ color: '#2E1810', fontWeight: 700 }}>{inputValue.trim() || 'Quý Khách & Gia Đình'}</strong>
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Copy Link Button */}
              <button
                type="button"
                onClick={() => copyInvitationLink(inputValue.trim() || undefined)}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.95rem',
                }}
              >
                {isCopied ? (
                  <>
                    <Check size={18} />
                    <span>Đã Sao Chép Đường Link!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Sao Chép Link Gửi Khách</span>
                  </>
                )}
              </button>

              {/* Re-open Envelope Preview Button */}
              {onResetEnvelope && (
                <button
                  type="button"
                  onClick={handleReopenEnvelope}
                  className="btn-outline"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    borderColor: 'rgba(213, 181, 140, 0.7)',
                    color: 'var(--color-plum)',
                  }}
                >
                  <RefreshCw size={15} />
                  <span>Mở Lại Phong Bì (Xem Bóc Tem)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
