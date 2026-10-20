import React from 'react';
import { FloralDivider } from './FloralDivider';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  variant?: 'gold' | 'rose';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  variant = 'gold',
  className = '',
}) => {
  const { ref, isIntersecting } = useScrollReveal<HTMLDivElement>({ threshold: 0.12 });

  return (
    <div
      ref={ref}
      className={`section-heading reveal-init ${isIntersecting ? 'is-revealed' : ''} ${className}`}
      style={{
        textAlign: align,
        marginBottom: '2.5rem',
      }}
    >
      {badge && (
        <span
          className="reveal-soft stagger-1"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'var(--color-rose-dark)',
            backgroundColor: 'var(--color-blush-light)',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            marginBottom: '0.85rem',
            border: '1px solid rgba(201, 130, 145, 0.25)',
          }}
        >
          {badge}
        </span>
      )}

      <h2
        className="reveal-soft stagger-2"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 4vw, 2.85rem)',
          fontWeight: 600,
          color: 'var(--color-plum)',
          letterSpacing: '0.02em',
          lineHeight: 1.2,
          margin: '0.25rem 0',
        }}
      >
        {title}
      </h2>

      <div className="reveal-soft stagger-3">
        <FloralDivider variant={variant} />
      </div>

      {subtitle && (
        <p
          className="reveal-soft stagger-4"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'var(--color-text-muted)',
            maxWidth: '640px',
            margin: align === 'center' ? '0 auto' : '0',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
