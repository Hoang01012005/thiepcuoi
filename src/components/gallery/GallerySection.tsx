import React, { useState, useRef, useEffect } from 'react';
import { GALLERY_PHOTOS, GALLERY_CATEGORIES, type PhotoAsset } from '../../config/photos';
import { translations, type Language } from '../../config/translations';
import { SectionHeading } from '../common/SectionHeading';
import { LightboxModal } from './LightboxModal';
import { Maximize2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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
        border: '1.5px solid rgba(198, 164, 106, 0.45)',
        background: 'var(--color-beige)',
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
          background: 'rgba(250, 247, 240, 0.94)',
          border: '1px solid rgba(198, 164, 106, 0.5)',
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
          background: 'rgba(250, 247, 240, 0.92)',
          border: '1px solid rgba(198, 164, 106, 0.45)',
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
          background: 'linear-gradient(to top, rgba(40, 31, 26, 0.88) 0%, rgba(40, 31, 26, 0.35) 65%, transparent 100%)',
          color: '#FAF7F0',
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
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);

  const t = translations[lang];

  const filteredPhotos = selectedCategory === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    setMobileActiveIndex(0);
    if (mobileSliderRef.current) {
      mobileSliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedCategory]);

  const handleMobileScroll = () => {
    const slider = mobileSliderRef.current;
    if (!slider) return;
    const scrollLeft = slider.scrollLeft;
    const firstItem = slider.firstElementChild as HTMLElement | null;
    const itemWidth = firstItem ? firstItem.offsetWidth + 16 : 300;
    const idx = Math.round(scrollLeft / itemWidth);
    setMobileActiveIndex(Math.max(0, Math.min(idx, filteredPhotos.length - 1)));
  };

  const scrollToSlide = (index: number) => {
    const slider = mobileSliderRef.current;
    if (!slider) return;
    const targetIdx = Math.max(0, Math.min(index, filteredPhotos.length - 1));
    const firstItem = slider.firstElementChild as HTMLElement | null;
    const itemWidth = firstItem ? firstItem.offsetWidth + 16 : 300;
    slider.scrollTo({ left: targetIdx * itemWidth, behavior: 'smooth' });
    setMobileActiveIndex(targetIdx);
  };

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
    <section id="gallery" className="section-wrapper" style={{ backgroundColor: 'var(--color-ivory)' }}>
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
                    ? 'linear-gradient(135deg, #FFFFFF 0%, #FAF7F0 100%)'
                    : 'rgba(250, 247, 240, 0.75)',
                  color: isActive ? 'var(--color-gold-dark)' : 'var(--color-plum)',
                  border: isActive
                    ? '1.5px solid var(--color-gold-champagne)'
                    : '1px solid rgba(198, 164, 106, 0.25)',
                  boxShadow: isActive
                    ? '0 6px 18px rgba(198, 164, 106, 0.25)'
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
                    background: isActive ? 'rgba(198, 164, 106, 0.18)' : 'rgba(64, 53, 47, 0.07)',
                    color: isActive ? 'var(--color-gold-dark)' : 'var(--color-text-muted)',
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
          {filteredPhotos.map((photo: PhotoAsset, index: number) => {
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

        {/* MOBILE VIEW: Horizontal Swipeable Carousel */}
        <div className="gallery-mobile-slider-container">
          {/* Top Counter Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 0.5rem 0.75rem',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-plum)',
            }}
          >
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={14} style={{ color: 'var(--color-gold-dark)' }} />
              {lang === 'vi' ? 'Album Ảnh Cưới' : 'Wedding Album'}
            </span>
            <span
              style={{
                background: 'rgba(198, 164, 106, 0.22)',
                border: '1px solid rgba(198, 164, 106, 0.45)',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                color: 'var(--color-gold-dark)',
                fontSize: '0.78rem',
              }}
            >
              {mobileActiveIndex + 1} / {filteredPhotos.length}
            </span>
          </div>

          {/* Swipeable Track */}
          <div
            ref={mobileSliderRef}
            onScroll={handleMobileScroll}
            className="gallery-mobile-slider"
          >
            {filteredPhotos.map((photo: PhotoAsset, index: number) => {
              const caption = lang === 'vi' ? photo.captionVi : photo.captionEn;
              return (
                <div
                  key={photo.id}
                  className="gallery-mobile-slide"
                  onClick={() => openLightbox(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${caption} (${t.gallery.viewPhoto})`}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '3/4',
                      background: 'var(--color-beige)',
                      overflow: 'hidden',
                    }}
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
                          objectPosition: photo.objectPosition || 'center 25%',
                        }}
                        loading={index < 2 ? 'eager' : 'lazy'}
                      />
                    </picture>

                    {/* Top Slide Number Pill */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.85rem',
                        left: '0.85rem',
                        background: 'rgba(250, 247, 240, 0.94)',
                        border: '1px solid rgba(198, 164, 106, 0.5)',
                        padding: '0.25rem 0.7rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: 'var(--color-plum)',
                        fontFamily: 'var(--font-sans)',
                        backdropFilter: 'blur(6px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      }}
                    >
                      #{String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Expand icon on top right */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.85rem',
                        right: '0.85rem',
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'rgba(250, 247, 240, 0.94)',
                        border: '1px solid rgba(198, 164, 106, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-plum)',
                        backdropFilter: 'blur(6px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      }}
                    >
                      <Maximize2 size={16} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Swipe Controls & Nav Dots */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.75rem',
              padding: '0 0.5rem',
            }}
          >
            <button
              type="button"
              onClick={() => scrollToSlide(mobileActiveIndex - 1)}
              disabled={mobileActiveIndex === 0}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid rgba(198, 164, 106, 0.5)',
                background: mobileActiveIndex === 0 ? 'rgba(232, 223, 210, 0.4)' : '#FFFFFF',
                color: mobileActiveIndex === 0 ? '#C5B5A8' : 'var(--color-plum)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: mobileActiveIndex === 0 ? 'default' : 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', overflowX: 'auto', maxWidth: '60vw', padding: '0.25rem 0' }}>
              {filteredPhotos.map((_, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToSlide(i)}
                  style={{
                    width: i === mobileActiveIndex ? '18px' : '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    background: i === mobileActiveIndex ? 'var(--color-gold-champagne)' : 'rgba(198, 164, 106, 0.45)',
                    border: 'none',
                    padding: 0,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollToSlide(mobileActiveIndex + 1)}
              disabled={mobileActiveIndex === filteredPhotos.length - 1}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid rgba(198, 164, 106, 0.5)',
                background: mobileActiveIndex === filteredPhotos.length - 1 ? 'rgba(232, 223, 210, 0.4)' : '#FFFFFF',
                color: mobileActiveIndex === filteredPhotos.length - 1 ? '#C5B5A8' : 'var(--color-plum)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: mobileActiveIndex === filteredPhotos.length - 1 ? 'default' : 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <p
            style={{
              textAlign: 'center',
              fontSize: '0.74rem',
              color: 'var(--color-gold-dark)',
              marginTop: '0.5rem',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {lang === 'vi' ? '← Vuốt sang ngang để xem từng ảnh cưới →' : '← Swipe horizontally to explore each photo →'}
          </p>
        </div>
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
