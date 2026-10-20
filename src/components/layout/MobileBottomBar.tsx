import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Image, HeartHandshake, Gift } from 'lucide-react';
import { type Language } from '../../config/translations';

interface MobileBottomBarProps {
  lang: Language;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ lang }) => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['gift', 'rsvp', 'gallery', 'event', 'hero'];
      const scrollY = window.scrollY + 200;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const items = [
    {
      id: 'hero',
      href: '#hero',
      label: lang === 'vi' ? 'Thiệp' : 'Home',
      icon: Mail,
    },
    {
      id: 'event',
      href: '#event',
      label: lang === 'vi' ? 'Tiệc Cưới' : 'Event',
      icon: MapPin,
    },
    {
      id: 'gallery',
      href: '#gallery',
      label: lang === 'vi' ? 'Album' : 'Photos',
      icon: Image,
    },
    {
      id: 'rsvp',
      href: '#rsvp',
      label: lang === 'vi' ? 'RSVP' : 'RSVP',
      icon: HeartHandshake,
    },
    {
      id: 'gift',
      href: '#gift',
      label: lang === 'vi' ? 'Mừng Cưới' : 'Gift',
      icon: Gift,
    },
  ];

  return (
    <nav className="mobile-bottom-dock" aria-label="Mobile Navigation Dock">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <a
            key={item.id}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.35rem 0.65rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              color: isActive ? 'var(--color-rose-dark)' : 'var(--color-plum)',
              background: isActive ? 'rgba(243, 213, 218, 0.45)' : 'transparent',
              transition: 'all 0.25s ease',
              minWidth: '54px',
            }}
          >
            <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} style={{ color: isActive ? 'var(--color-rose-dark)' : 'var(--color-plum)' }} />
            <span
              style={{
                fontSize: '0.66rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: isActive ? 700 : 500,
                marginTop: '0.15rem',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
};
