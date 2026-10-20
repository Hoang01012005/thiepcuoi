import React, { useState } from 'react';
import { translations, type Language } from '../../config/translations';
import { useGuestName } from '../../hooks/useGuestName';
import { SectionHeading } from '../common/SectionHeading';
import { BotanicalCorner } from '../common/BotanicalCorners';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useMagnetic } from '../../hooks/useMagnetic';
import { submitRsvp } from '../../services/rsvpService';
import confetti from 'canvas-confetti';
import { Heart, CheckCircle2, AlertCircle, Send } from 'lucide-react';

interface RsvpSectionProps {
  lang: Language;
}

interface RsvpFormData {
  name: string;
  status: 'yes' | 'no' | '';
  count: number;
  phone: string;
  message: string;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ lang }) => {
  const guestName = useGuestName();
  const t = translations[lang];
  const { ref: sectionRef, isIntersecting } = useScrollReveal({ threshold: 0.15 });
  const submitBtnRef = useMagnetic<HTMLButtonElement>(0.22);

  const [formData, setFormData] = useState<RsvpFormData>({
    name: guestName || '',
    status: '',
    count: 1,
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ name?: string; status?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const errs: { name?: string; status?: string } = {};
    if (!formData.name.trim()) {
      errs.name = t.rsvp.errors.nameRequired;
    }
    if (!formData.status) {
      errs.status = t.rsvp.errors.statusRequired;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const cleanName = formData.name.replace(/[<>]/g, '').trim().slice(0, 80);
    const cleanPhone = (formData.phone || '').replace(/[^\d+()-\s]/g, '').slice(0, 20);
    const cleanMessage = (formData.message || '').replace(/[<>]/g, '').trim().slice(0, 500);
    const cleanCount = Math.max(1, Math.min(10, Number(formData.count) || 1));

    try {
      await submitRsvp({
        name: cleanName,
        status: formData.status as 'yes' | 'no',
        count: cleanCount,
        phone: cleanPhone,
        message: cleanMessage,
      });
    } catch (err) {
      console.warn('Error submitting RSVP:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger celebratory confetti if attending
      if (formData.status === 'yes') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F3D5DA', '#C98291', '#D5B58C', '#EEDBC5'],
        });
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      status: '',
      count: 1,
      phone: '',
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <section ref={sectionRef} id="rsvp" className="section-wrapper">
      <div className="container">
        <SectionHeading
          badge={t.rsvp.badge}
          title={t.rsvp.title}
          subtitle={t.rsvp.subtitle}
        />

        <div
          className={`stationery-card reveal-init ${isIntersecting ? 'is-revealed' : ''}`}
          style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: 'clamp(2rem, 5vw, 3.25rem)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <BotanicalCorner position="top-left" size={54} color="rgba(213, 181, 140, 0.45)" />
          <BotanicalCorner position="top-right" size={54} color="rgba(213, 181, 140, 0.45)" />


          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <CheckCircle2 size={54} style={{ color: 'var(--color-rose)', margin: '0 auto 1.25rem' }} />
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  color: 'var(--color-plum)',
                  marginBottom: '0.75rem',
                }}
              >
                {t.rsvp.successTitle}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6,
                  maxWidth: '440px',
                  margin: '0 auto 2rem',
                }}
              >
                {t.rsvp.successDesc}
              </p>
              <button type="button" onClick={handleReset} className="btn-outline">
                {t.rsvp.resetBtn}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="rsvp-name"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--color-plum)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {t.rsvp.nameLabel}
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.rsvp.namePlaceholder}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: errors.name ? '1px solid #D9534F' : '1px solid rgba(201, 130, 145, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    color: 'var(--color-plum)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-rose)')}
                  onBlur={(e) => (e.target.style.borderColor = errors.name ? '#D9534F' : 'rgba(201, 130, 145, 0.3)')}
                />
                {errors.name && (
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#D9534F', fontSize: '0.82rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={14} />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Attendance Status */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--color-plum)',
                    marginBottom: '0.6rem',
                  }}
                >
                  {t.rsvp.statusLabel}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'yes' })}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.status === 'yes' ? '2px solid var(--color-rose)' : '1px solid rgba(201, 130, 145, 0.25)',
                      background: formData.status === 'yes' ? 'rgba(243, 213, 218, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                      color: formData.status === 'yes' ? 'var(--color-rose-dark)' : 'var(--color-plum)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                      fontWeight: formData.status === 'yes' ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Heart size={16} fill={formData.status === 'yes' ? 'currentColor' : 'none'} />
                    <span>{t.rsvp.statusYes}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'no' })}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.status === 'no' ? '2px solid var(--color-plum)' : '1px solid rgba(201, 130, 145, 0.25)',
                      background: formData.status === 'no' ? 'rgba(73, 52, 58, 0.08)' : 'rgba(255, 255, 255, 0.7)',
                      color: 'var(--color-plum)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                      fontWeight: formData.status === 'no' ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{t.rsvp.statusNo}</span>
                  </button>
                </div>
                {errors.status && (
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#D9534F', fontSize: '0.82rem', marginTop: '0.35rem' }}>
                    <AlertCircle size={14} />
                    <span>{errors.status}</span>
                  </p>
                )}
              </div>

              {/* Guest Count (if attending) */}
              {formData.status === 'yes' && (
                <div>
                  <label
                    htmlFor="rsvp-count"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--color-plum)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {t.rsvp.countLabel}
                  </label>
                  <select
                    id="rsvp-count"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.1rem',
                      background: 'rgba(255, 255, 255, 0.85)',
                      border: '1px solid rgba(201, 130, 145, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.95rem',
                      color: 'var(--color-plum)',
                      outline: 'none',
                    }}
                  >
                    <option value={1}>1 {lang === 'vi' ? 'người' : 'guest'}</option>
                    <option value={2}>2 {lang === 'vi' ? 'người' : 'guests'}</option>
                    <option value={3}>3 {lang === 'vi' ? 'người' : 'guests'}</option>
                    <option value={4}>4 {lang === 'vi' ? 'người' : 'guests'}</option>
                  </select>
                </div>
              )}

              {/* Phone */}
              <div>
                <label
                  htmlFor="rsvp-phone"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--color-plum)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {t.rsvp.phoneLabel}
                </label>
                <input
                  id="rsvp-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t.rsvp.phonePlaceholder}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    background: 'rgba(255, 255, 255, 0.85)',
                    border: '1px solid rgba(201, 130, 145, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.95rem',
                    color: 'var(--color-plum)',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="rsvp-msg"
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--color-plum)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {t.rsvp.messageLabel}
                </label>
                <textarea
                  id="rsvp-msg"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.rsvp.messagePlaceholder}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.1rem',
                    background: 'rgba(255, 255, 255, 0.85)',
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

              {/* Submit CTA */}
              <button
                ref={submitBtnRef}
                type="submit"
                disabled={isSubmitting}
                className="btn-primary magnetic-btn sheen-effect"
                style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  fontSize: '1rem',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                <Send size={16} />
                <span>{isSubmitting ? t.rsvp.submitting : t.rsvp.submitBtn}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
