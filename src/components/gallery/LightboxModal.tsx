import React, { useEffect, useCallback, useRef } from 'react';
import { type PhotoAsset } from '../../config/photos';
import { translations, type Language } from '../../config/translations';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxModalProps {
  photos: PhotoAsset[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  lang: Language;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
  lang,
}) => {
  const t = translations[lang];
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Touch swipe handling for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // px

    if (diff > minSwipeDistance) {
      // Swiped left -> next
      onNext();
    } else if (diff < -minSwipeDistance) {
      // Swiped right -> prev
      onPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'vi' ? currentPhoto.altVi : currentPhoto.altEn}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(20, 14, 17, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 3vw, 1.5rem)',
        userSelect: 'none',
      }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Bar */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(0.75rem, 2.5vw, 1.5rem)',
          left: 'clamp(1rem, 3vw, 2rem)',
          right: 'clamp(1rem, 3vw, 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Counter Pill */}
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: '#FFF9F6',
            letterSpacing: '0.08em',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(213, 181, 140, 0.35)',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(photos.length).padStart(2, '0')}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t.gallery.closeModal}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201, 130, 145, 0.4)';
            e.currentTarget.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <X size={22} />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        style={{
          position: 'relative',
          maxWidth: '92vw',
          maxHeight: '78vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <picture>
          <source srcSet={currentPhoto.src} type="image/webp" />
          <img
            src={currentPhoto.srcJpg}
            alt={lang === 'vi' ? currentPhoto.altVi : currentPhoto.altEn}
            style={{
              maxWidth: '100%',
              maxHeight: '78vh',
              objectFit: 'contain',
              borderRadius: '10px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(213, 181, 140, 0.3)',
              transition: 'opacity 0.25s ease',
            }}
          />
        </picture>
      </div>

      {/* Caption Bar */}
      <div
        style={{
          marginTop: '1.25rem',
          textAlign: 'center',
          maxWidth: '640px',
          padding: '0 1rem',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)',
            fontStyle: 'italic',
            color: '#FFF9F6',
            lineHeight: 1.45,
            letterSpacing: '0.02em',
          }}
        >
          &ldquo;{lang === 'vi' ? currentPhoto.captionVi : currentPhoto.captionEn}&rdquo;
        </p>
      </div>

      {/* Previous Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label={t.gallery.prevPhoto}
        style={{
          position: 'absolute',
          left: 'clamp(0.5rem, 2vw, 2rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(201, 130, 145, 0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronLeft size={30} />
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label={t.gallery.nextPhoto}
        style={{
          position: 'absolute',
          right: 'clamp(0.5rem, 2vw, 2rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(201, 130, 145, 0.4)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronRight size={30} />
      </button>
    </div>
  );
};
