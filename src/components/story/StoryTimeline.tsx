import React from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { PHOTO_REGISTRY } from '../../config/photos';
import { translations, type Language } from '../../config/translations';
import { SectionHeading } from '../common/SectionHeading';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Calendar, Sparkles } from 'lucide-react';

interface StoryTimelineProps {
  lang: Language;
}

const CHAPTER_ROMAN = ['Chapter I', 'Chapter II', 'Chapter III', 'Chapter IV'];
const CHAPTER_VI = ['Chương I', 'Chương II', 'Chương III', 'Chương IV'];

const STORY_OBJECT_POSITIONS: Record<string, string> = {
  story01: 'center 56%',
  story02: 'center 32%',
  story03: 'center 38%',
  story04: 'center 56%',
};

interface ChapterItemProps {
  item: typeof weddingConfig.story[0];
  index: number;
  lang: Language;
  chapterLabel: string;
}

const ChapterItem: React.FC<ChapterItemProps> = ({ item, index, lang, chapterLabel }) => {
  const { ref, isIntersecting } = useScrollReveal({ threshold: 0.2 });
  const isEven = index % 2 === 0;
  const photoAsset = PHOTO_REGISTRY[item.photoKey];

  return (
    <div
      ref={ref}
      className={`stationery-card reveal-init ${isIntersecting ? 'is-revealed' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(1.5rem, 4vw, 3rem)',
        alignItems: 'center',
        padding: 'clamp(1.75rem, 4vw, 2.75rem)',
        position: 'relative',
        transitionDelay: `${index * 0.12}s`,
      }}
    >
      {/* Decorative Botanical Corner */}
      <BotanicalCorner
        position={isEven ? 'top-right' : 'top-left'}
        size={52}
        color="rgba(213, 181, 140, 0.45)"
      />

      {/* Photo Column */}
      <div
        style={{
          order: isEven ? 1 : 2,
          display: 'flex',
          justifyContent: 'center',
          transform: isIntersecting ? 'translateX(0)' : `translateX(${isEven ? '-20px' : '20px'})`,
          transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '340px',
            aspectRatio: '2/3',
            borderRadius: 'var(--radius-arch)',
            overflow: 'hidden',
            border: '2.5px solid rgba(213, 181, 140, 0.5)',
            boxShadow: 'var(--shadow-md)',
            background: '#F7EFE9',
          }}
        >
          <picture>
            <source srcSet={photoAsset.src} type="image/webp" />
            <img
              src={photoAsset.srcJpg}
              alt={lang === 'vi' ? photoAsset.altVi : photoAsset.altEn}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: STORY_OBJECT_POSITIONS[item.photoKey] || 'center 50%',
                transition: 'transform 0.6s ease',
              }}
              loading="lazy"
            />
          </picture>

          {/* Small Chapter Badge on Image */}
          <div
            style={{
              position: 'absolute',
              top: '0.85rem',
              left: '0.85rem',
              background: 'rgba(255, 249, 246, 0.92)',
              border: '1px solid rgba(213, 181, 140, 0.5)',
              padding: '0.28rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: 'var(--color-plum)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(73, 52, 58, 0.08)',
            }}
          >
            {chapterLabel}
          </div>
        </div>
      </div>

      {/* Text Story Column */}
      <div
        style={{
          order: isEven ? 2 : 1,
          textAlign: 'left',
          padding: '0.5rem',
          transform: isIntersecting ? 'translateX(0)' : `translateX(${isEven ? '20px' : '-20px'})`,
          transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Chapter & Date Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              fontStyle: 'italic',
              color: 'var(--color-rose-dark)',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            {chapterLabel}
          </span>
          <span style={{ color: 'var(--color-gold)' }}>&bull;</span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.84rem',
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-text-muted)',
              fontWeight: 500,
            }}
          >
            <Calendar size={13} style={{ color: 'var(--color-rose)' }} />
            <span>{item.dateKey}</span>
          </div>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
            fontWeight: 600,
            color: 'var(--color-plum)',
            lineHeight: 1.25,
            marginBottom: '1rem',
          }}
        >
          {lang === 'vi' ? item.titleVi : item.titleEn}
        </h3>

        <p
          style={{
            color: 'var(--color-plum)',
            fontSize: '1rem',
            lineHeight: 1.75,
            marginBottom: '1.25rem',
            opacity: 0.92,
          }}
        >
          {lang === 'vi' ? item.descriptionVi : item.descriptionEn}
        </p>

        {/* Milestone Decorative Quote Accent */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            background: 'rgba(243, 213, 218, 0.25)',
            borderLeft: '2.5px solid var(--color-rose)',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.82rem',
            fontStyle: 'italic',
            color: 'var(--color-rose-dark)',
            fontFamily: 'var(--font-serif)',
          }}
        >
          <Sparkles size={13} style={{ color: 'var(--color-gold-dark)' }} />
          <span>Nam &amp; Hiệp &bull; {chapterLabel}</span>
        </div>
      </div>
    </div>
  );
};

export const StoryTimeline: React.FC<StoryTimelineProps> = ({ lang }) => {
  const t = translations[lang];
  const { story } = weddingConfig;

  return (
    <section id="story" className="section-wrapper">
      <div className="container">
        <SectionHeading
          badge={t.story.badge}
          title={t.story.title}
          subtitle={t.story.subtitle}
        />

        {/* Narrative Monograph Chapters Container */}
        <div
          style={{
            position: 'relative',
            maxWidth: '960px',
            margin: '3.5rem auto 0',
          }}
        >
          {/* Continuous Champagne Timeline Thread */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              bottom: '40px',
              left: '50%',
              width: '2px',
              background: 'linear-gradient(180deg, rgba(213, 181, 140, 0.1) 0%, rgba(213, 181, 140, 0.75) 20%, rgba(201, 130, 145, 0.75) 80%, rgba(213, 181, 140, 0.1) 100%)',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
            className="story-timeline-thread"
          />

          {/* Desktop Timeline */}
          <div className="story-chapters-desktop" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', position: 'relative', zIndex: 2 }}>
            {story.map((item, index) => {
              const chapterLabel = lang === 'vi' ? CHAPTER_VI[index] : CHAPTER_ROMAN[index];
              return (
                <ChapterItem
                  key={item.id}
                  item={item}
                  index={index}
                  lang={lang}
                  chapterLabel={chapterLabel}
                />
              );
            })}
          </div>

          {/* Mobile Horizontal Storybook Carousel */}
          <div className="story-chapters-mobile">
            {story.map((item, index) => {
              const chapterLabel = lang === 'vi' ? CHAPTER_VI[index] : CHAPTER_ROMAN[index];
              const photoAsset = PHOTO_REGISTRY[item.photoKey];
              return (
                <div
                  key={item.id}
                  className="story-mobile-card stationery-card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '18px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <BotanicalCorner position="top-right" size={42} color="rgba(213, 181, 140, 0.45)" />

                  {/* Photo Banner */}
                  <div
                    style={{
                      width: '100%',
                      height: '235px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1.5px solid rgba(213, 181, 140, 0.5)',
                      marginBottom: '1rem',
                      background: '#F7EFE9',
                      position: 'relative',
                    }}
                  >
                    <picture>
                      <source srcSet={photoAsset.src} type="image/webp" />
                      <img
                        src={photoAsset.srcJpg}
                        alt={lang === 'vi' ? photoAsset.altVi : photoAsset.altEn}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: STORY_OBJECT_POSITIONS[item.photoKey] || 'center 50%',
                        }}
                        loading="lazy"
                      />
                    </picture>
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.65rem',
                        left: '0.65rem',
                        background: 'rgba(255, 249, 246, 0.94)',
                        border: '1px solid rgba(213, 181, 140, 0.5)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--color-plum)',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {chapterLabel}
                    </div>
                  </div>

                  {/* Date badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <Calendar size={13} style={{ color: 'var(--color-rose)' }} />
                    <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-sans)', fontWeight: 600, color: 'var(--color-rose-dark)', letterSpacing: '0.08em' }}>
                      {item.year}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: 'var(--color-plum)',
                      marginBottom: '0.5rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {lang === 'vi' ? item.titleVi : item.titleEn}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.84rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.55,
                    }}
                  >
                    {lang === 'vi' ? item.descriptionVi : item.descriptionEn}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile Swipe Hint */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              color: 'var(--color-rose-dark)',
              fontFamily: 'var(--font-sans)',
            }}
            className="show-on-mobile-only"
          >
            <span>&larr; Vuốt ngang xem 4 chương kỷ niệm &rarr;</span>
          </div>
        </div>
      </div>
    </section>
  );
};
