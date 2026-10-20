import React, { useState, useEffect } from 'react';
import { translations, type Language } from '../../config/translations';
import { SectionHeading } from '../common/SectionHeading';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useMagnetic } from '../../hooks/useMagnetic';
import { MessageSquare, Send, Heart, User } from 'lucide-react';

interface WishesSectionProps {
  lang: Language;
}

interface WishItem {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

const INITIAL_WISHES: WishItem[] = [
  {
    id: 'w-1',
    name: 'Hoàng Long & Thu Thảo',
    message: 'Chúc mừng hạnh phúc đôi bạn trẻ! Chúc hai bạn trăm năm hòa hợp, luôn nắm chặt tay nhau vượt qua mọi thử thách của cuộc sống.',
    createdAt: 'Hôm nay',
  },
  {
    id: 'w-2',
    name: 'Minh Anh',
    message: 'Thật xúc động khi thấy hai bạn chính thức về chung một nhà! Chúc Nam và Hiệp một đời an yên, ngọt ngào và hạnh phúc viên mãn.',
    createdAt: 'Hôm qua',
  },
  {
    id: 'w-3',
    name: 'Gia đình Bác Hùng',
    message: 'Chúc hai cháu trăm năm hạnh phúc, con đàn cháu đống, gia đình êm ấm thuận hòa!',
    createdAt: '2 ngày trước',
  },
];

export const WishesSection: React.FC<WishesSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const { ref: sectionRef, isIntersecting } = useScrollReveal({ threshold: 0.15 });
  const sendBtnRef = useMagnetic<HTMLButtonElement>(0.2);

  const [wishes, setWishes] = useState<WishItem[]>(() => {
    const saved = localStorage.getItem('wedding_wishes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_WISHES;
      }
    }
    return INITIAL_WISHES;
  });

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
  }, [wishes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.replace(/[<>]/g, '').trim().slice(0, 80);
    const cleanMessage = message.replace(/[<>]/g, '').trim().slice(0, 500);

    if (!cleanName || !cleanMessage) {
      setError(lang === 'vi' ? 'Vui lòng nhập tên và lời chúc của bạn' : 'Please enter your name and blessing message');
      return;
    }

    const newWish: WishItem = {
      id: `w-${Date.now()}`,
      name: cleanName,
      message: cleanMessage,
      createdAt: t.wishes.justNow,
    };

    setWishes([newWish, ...wishes].slice(0, 100));
    setName('');
    setMessage('');
    setError('');
  };

  return (
    <section ref={sectionRef} id="wishes" className="section-wrapper" style={{ backgroundColor: '#FDF7F4' }}>
      <div className="container">
        <SectionHeading
          badge={t.wishes.badge}
          title={t.wishes.title}
          subtitle={t.wishes.subtitle}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            maxWidth: '1020px',
            margin: '3rem auto 0',
          }}
        >
          {/* Left Form */}
          <div
            className={`stationery-card reveal-init ${isIntersecting ? 'is-revealed' : ''}`}
            style={{
              padding: 'clamp(1.85rem, 4.5vw, 2.75rem)',
              height: 'fit-content',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <BotanicalCorner position="top-left" size={54} color="rgba(213, 181, 140, 0.45)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(243, 213, 218, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-rose-dark)',
                  flexShrink: 0,
                }}
              >
                <Heart size={18} fill="currentColor" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-plum)', margin: 0 }}>
                  {t.wishes.title}
                </h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label
                  htmlFor="wish-name"
                  style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-plum)', marginBottom: '0.4rem' }}
                >
                  {t.wishes.nameLabel}
                </label>
                <input
                  id="wish-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.wishes.namePlaceholder}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(201, 130, 145, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    color: 'var(--color-plum)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="wish-msg"
                  style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-plum)', marginBottom: '0.4rem' }}
                >
                  {t.wishes.messageLabel}
                </label>
                <textarea
                  id="wish-msg"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.wishes.messagePlaceholder}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(201, 130, 145, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    color: 'var(--color-plum)',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {error && (
                <p style={{ color: '#D9534F', fontSize: '0.85rem' }}>{error}</p>
              )}

              <button ref={sendBtnRef} type="submit" className="btn-primary magnetic-btn sheen-effect" style={{ marginTop: '0.5rem' }}>
                <Send size={15} />
                <span>{t.wishes.sendBtn}</span>
              </button>
            </form>
          </div>

          {/* Right Wishes Wall Feed */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '520px',
              overflowY: 'auto',
              paddingRight: '0.5rem',
            }}
          >
            {wishes.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1.5rem',
                  background: 'var(--glass-bg)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed rgba(201, 130, 145, 0.3)',
                }}
              >
                <MessageSquare size={36} style={{ color: 'var(--color-rose)', margin: '0 auto 1rem' }} />
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
                  {t.wishes.emptyState}
                </p>
              </div>
            ) : (
              wishes.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#FFFDFC',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.35rem 1.6rem',
                    border: '1px solid rgba(213, 181, 140, 0.4)',
                    boxShadow: '0 4px 16px rgba(73, 52, 58, 0.05)',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(243, 213, 218, 0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <User size={14} style={{ color: 'var(--color-rose-dark)' }} />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-plum)' }}>
                        {item.name}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {item.createdAt}
                    </span>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.92rem',
                      color: 'var(--color-plum)',
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                      paddingLeft: '2.25rem',
                    }}
                  >
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
