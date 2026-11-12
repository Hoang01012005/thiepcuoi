import React, { useState, useEffect, useCallback, useRef } from 'react';
import { translations, type Language } from '../../config/translations';
import { SectionHeading } from '../common/SectionHeading';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useGuestName } from '../../hooks/useGuestName';
import {
  getAllUnifiedWishes,
  getSavedWishes,
  sanitizeWishText,
  submitWish,
  subscribeToWishUpdates,
  type WishItem,
} from '../../services/wishesService';
import { MessageSquare, Send, Heart, User, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface WishesSectionProps {
  lang: Language;
}

const NAME_MAX_LENGTH = 80;
const MESSAGE_MAX_LENGTH = 500;

export const WishesSection: React.FC<WishesSectionProps> = ({ lang }) => {
  const t = translations[lang];
  const guestName = useGuestName();
  const sendBtnRef = useMagnetic<HTMLButtonElement>(0.2);

  const [wishes, setWishes] = useState<WishItem[]>(() => getSavedWishes());
  const [isLoading, setIsLoading] = useState<boolean>(() => getSavedWishes().length === 0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const [name, setName] = useState(() => guestName || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'warning'; text: string } | null>(null);

  const isMountedRef = useRef(true);
  const hasEditedNameRef = useRef(false);
  const syncSeqRef = useRef(0);
  const noticeTimerRef = useRef<number | null>(null);
  const resyncTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (guestName && !hasEditedNameRef.current) {
      setName(guestName);
    }
  }, [guestName]);

  const syncWishes = useCallback(async () => {
    const seq = ++syncSeqRef.current;
    try {
      const { wishes: unified, remoteSynced } = await getAllUnifiedWishes();
      if (isMountedRef.current && seq === syncSeqRef.current) {
        setWishes(unified);
        setLoadFailed(!remoteSynced);
      }
    } catch {
      if (isMountedRef.current && seq === syncSeqRef.current) {
        setLoadFailed(true);
      }
    } finally {
      if (isMountedRef.current && seq === syncSeqRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    void syncWishes();
  };

  useEffect(() => {
    isMountedRef.current = true;
    void syncWishes();

    const unsubscribe = subscribeToWishUpdates((updated) => {
      if (isMountedRef.current) {
        setWishes(updated);
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void syncWishes();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current);
      if (resyncTimerRef.current !== null) window.clearTimeout(resyncTimerRef.current);
    };
  }, [syncWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cleanName = sanitizeWishText(name, NAME_MAX_LENGTH);
    const cleanMessage = sanitizeWishText(message, MESSAGE_MAX_LENGTH);

    if (!cleanName || !cleanMessage) {
      setError(t.wishes.validationError);
      return;
    }

    // Invalidate any in-flight sync so it cannot overwrite this optimistic submission.
    syncSeqRef.current += 1;
    setIsSubmitting(true);
    setError('');
    setNotice(null);

    try {
      const result = await submitWish({
        name: cleanName,
        message: cleanMessage,
        justNowLabel: t.wishes.justNow,
      });

      if (!isMountedRef.current) return;

      if (!result.wish) {
        setError(t.wishes.validationError);
        return;
      }

      setWishes(getSavedWishes());
      hasEditedNameRef.current = false;
      setName(guestName || '');
      setMessage('');
      setNotice({
        type: result.synced ? 'success' : 'warning',
        text: result.synced ? t.wishes.successNotice : t.wishes.syncFailedNotice,
      });

      if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = window.setTimeout(() => {
        if (isMountedRef.current) setNotice(null);
      }, 5000);

      if (result.synced) {
        if (resyncTimerRef.current !== null) window.clearTimeout(resyncTimerRef.current);
        resyncTimerRef.current = window.setTimeout(() => {
          void syncWishes();
        }, 3500);
      }
    } catch {
      if (isMountedRef.current) {
        setNotice({
          type: 'warning',
          text: t.wishes.syncFailedNotice,
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section id="wishes" className="section-wrapper" style={{ backgroundColor: 'var(--color-ivory)' }}>
      <div className="container">
        <SectionHeading
          badge={t.wishes.badge}
          title={t.wishes.title}
          subtitle={t.wishes.subtitle}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '3rem',
            maxWidth: '1020px',
            margin: '3rem auto 0',
          }}
        >
          {/* Left Form */}
          <div
            className="stationery-card reveal-init"
            style={{
              padding: 'clamp(1.85rem, 4.5vw, 2.75rem)',
              height: 'fit-content',
              position: 'relative',
              overflow: 'hidden',
              background: 'var(--color-ivory-light)',
              border: '1px solid var(--color-warm-beige)',
              boxShadow: 'var(--shadow-paper)',
            }}
          >
            <BotanicalCorner position="top-left" size={54} color="rgba(198, 164, 106, 0.45)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(201, 154, 154, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-dusty-rose)',
                  flexShrink: 0,
                }}
              >
                <Heart size={18} fill="currentColor" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-deep-brown)', margin: 0 }}>
                  {t.wishes.title}
                </h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label
                  htmlFor="wish-name"
                  style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-deep-brown)', marginBottom: '0.4rem' }}
                >
                  {t.wishes.nameLabel}
                </label>
                <input
                  id="wish-name"
                  type="text"
                  maxLength={NAME_MAX_LENGTH}
                  value={name}
                  onChange={(e) => {
                    hasEditedNameRef.current = true;
                    setName(e.target.value);
                  }}
                  placeholder={t.wishes.namePlaceholder}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    background: '#FFFFFF',
                    border: '1px solid var(--color-warm-beige)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    color: 'var(--color-deep-brown)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-champagne-gold)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-warm-beige)')}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <label
                    htmlFor="wish-msg"
                    style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-deep-brown)' }}
                  >
                    {t.wishes.messageLabel}
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {message.length}/{MESSAGE_MAX_LENGTH}
                  </span>
                </div>
                <textarea
                  id="wish-msg"
                  rows={4}
                  maxLength={MESSAGE_MAX_LENGTH}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.wishes.messagePlaceholder}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    background: '#FFFFFF',
                    border: '1px solid var(--color-warm-beige)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    color: 'var(--color-deep-brown)',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-champagne-gold)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-warm-beige)')}
                />
              </div>

              {error && (
                <p role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D9534F', fontSize: '0.85rem', margin: 0 }}>
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </p>
              )}

              {notice && (
                <div
                  role="status"
                  aria-live="polite"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    background: notice.type === 'success' ? 'rgba(16, 124, 65, 0.1)' : 'rgba(198, 164, 106, 0.18)',
                    color: notice.type === 'success' ? '#107C41' : 'var(--color-deep-brown)',
                    border: notice.type === 'success' ? '1px solid rgba(16, 124, 65, 0.25)' : '1px solid rgba(198, 164, 106, 0.45)',
                  }}
                >
                  {notice.type === 'success' ? (
                    <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                  ) : (
                    <AlertCircle size={15} style={{ flexShrink: 0, color: 'var(--color-gold-dark)' }} />
                  )}
                  <span>{notice.text}</span>
                </div>
              )}

              <button
                ref={sendBtnRef}
                type="submit"
                disabled={isSubmitting}
                className="btn-primary magnetic-btn sheen-effect"
                style={{ marginTop: '0.5rem', opacity: isSubmitting ? 0.75 : 1, cursor: isSubmitting ? 'wait' : 'pointer' }}
              >
                <Send size={15} />
                <span>{isSubmitting ? t.wishes.sendingBtn : t.wishes.sendBtn}</span>
              </button>
            </form>
          </div>

          {/* Right Wishes Wall Feed */}
          <div
            className="reveal-init"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                paddingBottom: '0.25rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.02em',
                }}
              >
                {t.wishes.feedHeader} ({wishes.length})
              </span>

              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                aria-label={t.wishes.refreshBtn}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.32rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-ivory-light)',
                  border: '1px solid var(--color-warm-beige)',
                  color: 'var(--color-deep-brown)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: isRefreshing ? 'wait' : 'pointer',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <RefreshCw
                  size={12}
                  style={{
                    animation: isRefreshing ? 'spinSlow 1s linear infinite' : 'none',
                  }}
                />
                <span>{isRefreshing ? t.wishes.refreshingBtn : t.wishes.refreshBtn}</span>
              </button>
            </div>

            {loadFailed && (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(198, 164, 106, 0.16)',
                  border: '1px solid rgba(198, 164, 106, 0.4)',
                  color: 'var(--color-deep-brown)',
                  fontSize: '0.8rem',
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0, color: 'var(--color-gold-dark)' }} />
                <span>{t.wishes.loadFailedNotice}</span>
              </div>
            )}

            <div
              className="wishes-feed-container"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxHeight: '520px',
                overflowY: 'auto',
                paddingRight: '0.5rem',
              }}
            >
              {isLoading && wishes.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: 'var(--glass-bg)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px dashed var(--color-warm-beige)',
                  }}
                >
                  <RefreshCw
                    size={28}
                    style={{
                      color: 'var(--color-champagne-gold)',
                      margin: '0 auto 0.9rem',
                      animation: 'spinSlow 1.4s linear infinite',
                    }}
                  />
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    {t.wishes.loadingState}
                  </p>
                </div>
              ) : wishes.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    background: 'var(--glass-bg)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px dashed var(--color-warm-beige)',
                  }}
                >
                  <MessageSquare size={36} style={{ color: 'var(--color-champagne-gold)', margin: '0 auto 1rem' }} />
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    {t.wishes.emptyState}
                  </p>
                </div>
              ) : (
                wishes.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--color-ivory-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.35rem 1.6rem',
                      border: '1px solid var(--color-warm-beige)',
                      boxShadow: 'var(--shadow-paper)',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'rgba(201, 154, 154, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <User size={14} style={{ color: 'var(--color-dusty-rose)' }} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-deep-brown)' }}>
                          {item.name}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {item.createdAt || t.wishes.justNow}
                      </span>
                    </div>

                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.92rem',
                        color: 'var(--color-deep-brown)',
                        lineHeight: 1.6,
                        fontStyle: 'italic',
                        paddingLeft: '2.25rem',
                        margin: 0,
                        wordBreak: 'break-word',
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
      </div>
    </section>
  );
};
