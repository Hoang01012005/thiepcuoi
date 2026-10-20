import React, { useState, useRef } from 'react';
import { GALLERY_PHOTOS, GALLERY_CATEGORIES, type PhotoAsset } from '../../config/photos';
import { translations, type Language } from '../../config/translations';
import { SectionHeading } from '../common/SectionHeading';
import { LightboxModal } from './LightboxModal';
import { Maximize2, Sparkles } from 'lucide-react';

interface GallerySectionProps {
  lang: Language;
}

interface TiltGalleryCardProps {
  photo: PhotoAsset;
  index: number;
  isFeatured: boolean;
  lang: Language;
  onOpen: () => void;
  viewPhotoLabel: string;
}

const TiltGalleryCard: React.FC<TiltGalleryCardProps> = ({
  photo,
  index,
  isFeatured,
  lang,
  onOpen,
  viewPhotoLabel,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const isTouch = window.matchMedia('(hover: none)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 4.5;
    const rotY = (x / (rect.width / 2)) * 4.5;

    card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)';
  };

  return (
    <div
      ref={cardRef}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={`${lang === 'vi' ? photo.captionVi : photo.captionEn} (${viewPhotoLabel})`}
      style={{
        position: 'relative',
        aspectRatio: isFeatured ? '16/11' : '2/3',
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-md)',
        border: '1.5px solid rgba(213, 181, 140, 0.45)',
        background: '#F7EFE9',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease',
        gridColumn: isFeatured ? 'span 2' : 'span 1',
        transformStyle: 'preserve-3d',
      }}
      className={`gallery-card ${isFeatured ? 'gallery-card-featured' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <picture>
        <source srcSet={photo.src} type="image/webp" />
        <img
          src={photo.srcJpg}
          alt={lang === 'vi' ? photo.altVi : photo.altEn}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: photo.objectPosition || 'center 20%',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          loading="lazy"
        />
      </picture>

      {/* Minimalist Editorial Sequence Pill (Top Left) */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'rgba(255, 249, 246, 0.92)',
          border: '1px solid rgba(213, 181, 140, 0.5)',
          padding: '0.25rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.74rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: 'var(--color-plum)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
        }}
      >
        <Sparkles size={11} style={{ color: 'var(--color-gold-dark)' }} />
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>

      {/* Expand Icon Badge (Top Right) */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(255, 249, 246, 0.9)',
          border: '1px solid rgba(213, 181, 140, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-plum)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
          transition: 'all 0.25s ease',
        }}
      >
        <Maximize2 size={16} />
      </div>

      {/* Elegant Caption Overlay on Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'clamp(1.2rem, 3vw, 2rem) clamp(1rem, 2.5vw, 1.5rem)',
          background: 'linear-gradient(to top, rgba(38, 23, 30, 0.88) 0%, rgba(38, 23, 30, 0.35) 65%, transparent 100%)',
          color: '#FFF9F6',
          transform: 'translateY(10px)',
          opacity: 0.9,
          transition: 'all 0.35s ease',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: isFeatured ? '1.25rem' : '1.05rem',
            fontStyle: 'italic',
            fontWeight: 500,
            letterSpacing: '0.03em',
            lineHeight: 1.35,
            color: '#FFFFFF',
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }}
        >
          {lang === 'vi' ? photo.captionVi : photo.captionEn}
        </p>
      </div>
    </div>
  );
};

export const GallerySection: React.FC<GallerySectionProps> = ({ lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'garden' | 'editorial' | 'celebration'>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const t = translations[lang];

  const filteredPhotos = selectedCategory === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === selectedCategory);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const displayedPhotos = (!mobileExpanded && isMobile && selectedCategory === 'all')
    ? filteredPhotos.slice(0, 4)
    : filteredPhotos;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
  };

  const getCategoryCount = (catId: 'all' | 'garden' | 'editorial' | 'celebration') => {
    if (catId === 'all') return GALLERY_PHOTOS.length;
    return GALLERY_PHOTOS.filter((p) => p.category === catId).length;
  };

  const isFilteredSmall = selectedCategory !== 'all' && filteredPhotos.length <= 2;
  const isFilteredMedium = selectedCategory !== 'all' && filteredPhotos.length === 3;

  return (
    <section id="gallery" className="section-wrapper" style={{ backgroundColor: '#FDF7F4' }}>
      <div style={{ width: '100%', maxWidth: '1220px', margin: '0 auto', padding: '0 clamp(1rem, 3vw, 2rem)' }}>
        <SectionHeading
          badge={t.gallery.badge}
          title={t.gallery.title}
          subtitle={t.gallery.subtitle}
        />

        {/* Category Tabs with Dynamic Item Count Badges */}
        <div
          role="tablist"
          aria-label={t.gallery.title}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.65rem',
            margin: '2rem 0 3.25rem',
          }}
        >
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = getCategoryCount(cat.id);
            const label = lang === 'vi' ? cat.labelVi : cat.labelEn;

            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.35rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '0.03em',
                  background: isActive
                    ? 'linear-gradient(135deg, #FFF9F6 0%, #FAF0EB 100%)'
                    : 'rgba(255, 249, 246, 0.75)',
                  color: isActive ? 'var(--color-rose-dark)' : 'var(--color-plum)',
                  border: isActive
                    ? '1.5px solid var(--color-rose)'
                    : '1px solid rgba(201, 130, 145, 0.25)',
                  boxShadow: isActive
                    ? '0 6px 18px rgba(201, 130, 145, 0.25)'
                    : 'var(--shadow-sm)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                }}
              >
                <span>{label}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'rgba(201, 130, 145, 0.18)' : 'rgba(73, 52, 58, 0.07)',
                    color: isActive ? 'var(--color-rose-dark)' : 'var(--color-text-muted)',
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Editorial Photo Gallery Grid with 3D Tilt Micro-interactions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(1rem, 2.5vw, 1.75rem)',
            maxWidth: isFilteredSmall ? '780px' : isFilteredMedium ? '1060px' : '100%',
            margin: '0 auto',
            transition: 'all 0.3s ease',
          }}
          className={`editorial-gallery-grid ${selectedCategory === 'all' ? 'is-all-view' : ''}`}
        >
          {displayedPhotos.map((photo: PhotoAsset, index: number) => {
            const isFeatured = selectedCategory === 'all' && photo.editorialSpanDesktop === 2;

            return (
              <TiltGalleryCard
                key={photo.id}
                photo={photo}
                index={index}
                isFeatured={Boolean(isFeatured)}
                lang={lang}
                onOpen={() => openLightbox(index)}
                viewPhotoLabel={t.gallery.viewPhoto}
              />
            );
          })}
        </div>

        {/* Mobile Expand / Collapse Button */}
        {selectedCategory === 'all' && filteredPhotos.length > 4 && (
          <div className="gallery-mobile-expand" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setMobileExpanded(!mobileExpanded)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.6rem',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, rgba(243, 213, 218, 0.6) 0%, rgba(255, 249, 246, 0.95) 100%)',
                border: '1.5px solid rgba(201, 130, 145, 0.45)',
                color: 'var(--color-rose-dark)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span>
                {mobileExpanded
                  ? (lang === 'vi' ? 'Thu gọn ảnh cưới ▴' : 'Show fewer photos ▴')
                  : (lang === 'vi' ? `Xem toàn bộ ${filteredPhotos.length} ảnh cưới ▾` : `View all ${filteredPhotos.length} photos ▾`)}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal with Keyboard & Mobile Touch Gestures */}
      <LightboxModal
        photos={filteredPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={handlePrev}
        onNext={handleNext}
        lang={lang}
      />
    </section>
  );
};
