import React, { useState, useEffect } from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import { Sparkles, Copy, Check, ExternalLink, Plus, Trash2, ArrowLeft, ShieldCheck, Heart, User, Search } from 'lucide-react';

interface ManagedGuest {
  id: string;
  name: string;
  createdAt: string;
}

const DEFAULT_CHIPS = ['Anh', 'Chị', 'Em', 'Bạn', 'Gia đình', 'Cô Chú', 'Bác'];

export const InviteGeneratorPage: React.FC = () => {
  const [guestNameInput, setGuestNameInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Local storage guest list
  const [guestList, setGuestList] = useState<ManagedGuest[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_managed_guests');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { id: 'g-1', name: 'Gia Đình Bác Hùng', createdAt: 'Mẫu gợi ý' },
      { id: 'g-2', name: 'Anh Hoàng', createdAt: 'Mẫu gợi ý' },
      { id: 'g-3', name: 'Bạn Thảo My', createdAt: 'Mẫu gợi ý' },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('wedding_managed_guests', JSON.stringify(guestList));
    } catch {
      // ignore
    }
  }, [guestList]);

  // Construct invitation URL for any given name
  const getFullUrl = (name: string): string => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin + window.location.pathname;
    if (!name.trim()) return base;
    return `${base}?to=${encodeURIComponent(name.trim())}`;
  };

  const handleCopy = async (id: string, name: string) => {
    const url = getFullUrl(name);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleAddGuest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = guestNameInput.trim();
    if (!trimmed) return;

    // Check if already in list
    if (!guestList.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())) {
      const newGuest: ManagedGuest = {
        id: `g-${Date.now()}`,
        name: trimmed,
        createdAt: 'Vừa tạo',
      };
      setGuestList([newGuest, ...guestList]);
    }
  };

  const handleDeleteGuest = (id: string) => {
    setGuestList(guestList.filter((g) => g.id !== id));
  };

  const handleChipClick = (chip: string) => {
    let current = guestNameInput.trim();
    if (!current) {
      current = chip + ' ';
    } else if (!current.startsWith(chip)) {
      current = `${chip} ${current}`;
    }
    setGuestNameInput(current);
  };

  const filteredGuests = guestList.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FFF9F6',
        color: 'var(--color-plum)',
        fontFamily: 'var(--font-sans)',
        padding: 'clamp(2rem, 5vw, 4rem) 1.25rem',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        {/* Top Back Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: 'var(--color-plum)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(213, 181, 140, 0.2)',
              border: '1px solid rgba(213, 181, 140, 0.45)',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={16} />
            <span>Trở về xem thiệp cưới</span>
          </a>

          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: 'var(--color-rose-dark)',
            }}
          >
            {weddingConfig.couple.monogram}
          </span>
        </div>

        {/* Portal Header */}
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(213, 181, 140, 0.2) 0%, rgba(243, 213, 218, 0.3) 100%)',
              border: '1px solid rgba(213, 181, 140, 0.5)',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-gold-dark)',
              marginBottom: '1rem',
            }}
          >
            <ShieldCheck size={16} />
            <span>Khu Vực Quản Lý Thiệp Cưới (Dành Riêng Cho Dâu Rể)</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              color: 'var(--color-plum)',
              margin: '0 0 0.75rem',
            }}
          >
            Tạo &amp; Gửi Thiệp Mời Riêng Cho Từng Khách
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-muted)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Nhập tên khách mời để tạo đường link độc lập, chính xác tuyệt đối. Khách nhận link sẽ mở ra thiệp mang tên riêng của họ và <strong>hoàn toàn không thấy nút chỉnh sửa tên</strong>.
          </p>
        </header>

        {/* Generator Card */}
        <div
          className="stationery-card"
          style={{
            padding: 'clamp(2rem, 5vw, 2.85rem)',
            marginBottom: '3rem',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Sparkles size={22} style={{ color: 'var(--color-gold-dark)' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', margin: 0, color: 'var(--color-plum)' }}>
              Tạo Link Thiệp Mới
            </h2>
          </div>

          {/* Quick Chips */}
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.45rem' }}>
              Gợi ý xưng hô nhanh:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {DEFAULT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    background: '#FFFFFF',
                    border: '1px solid rgba(213, 181, 140, 0.45)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    color: 'var(--color-plum)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-rose)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(213, 181, 140, 0.45)')}
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input Form */}
          <form onSubmit={handleAddGuest} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={guestNameInput}
              onChange={(e) => setGuestNameInput(e.target.value)}
              placeholder="Nhập tên khách mời (ví dụ: Anh Hoàng, Gia Đình Bác Hùng, Bạn Linh...)"
              style={{
                flex: '1 1 320px',
                padding: '0.9rem 1.15rem',
                fontSize: '1rem',
                background: '#FFFFFF',
                border: '1.5px solid #D5B58C',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-plum)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!guestNameInput.trim()}
              className="btn-primary"
              style={{
                padding: '0.9rem 1.5rem',
                opacity: guestNameInput.trim() ? 1 : 0.6,
                cursor: guestNameInput.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              <Plus size={18} />
              <span>Thêm Vào Danh Sách</span>
            </button>
          </form>

          {/* Real-time Link Preview Box */}
          {guestNameInput.trim() && (
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(213, 181, 140, 0.18) 0%, rgba(243, 213, 218, 0.28) 100%)',
                border: '1px solid rgba(213, 181, 140, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-gold-dark)', textTransform: 'uppercase' }}>
                  Đường Link Tạo Riêng:
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-plum)' }}>
                  Kính gửi: <strong style={{ color: '#2E1810', fontWeight: 700 }}>{guestNameInput.trim()}</strong>
                </span>
              </div>

              <div
                style={{
                  background: '#FFFFFF',
                  padding: '0.65rem 0.95rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(213, 181, 140, 0.4)',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  color: 'var(--color-plum)',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                }}
              >
                {getFullUrl(guestNameInput)}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={() => handleCopy('new', guestNameInput)}
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
                >
                  {copiedId === 'new' ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedId === 'new' ? 'Đã Sao Chép!' : 'Sao Chép Link'}</span>
                </button>

                <a
                  href={getFullUrl(guestNameInput)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem', textDecoration: 'none' }}
                >
                  <ExternalLink size={16} />
                  <span>Mở Xem Thử (Tab Mới)</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Guest List Directory */}
        <div className="stationery-card" style={{ padding: 'clamp(2rem, 5vw, 2.85rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', margin: 0, color: 'var(--color-plum)' }}>
                Danh Sách Khách Đã Tạo ({guestList.length})
              </h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Bấm sao chép link tương ứng để gửi cho từng người qua Zalo, Messenger, SMS
              </p>
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', width: '240px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên khách..."
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem',
                  paddingLeft: '2.1rem',
                  fontSize: '0.85rem',
                  background: '#FFFFFF',
                  border: '1px solid rgba(213, 181, 140, 0.45)',
                  borderRadius: 'var(--radius-full)',
                  outline: 'none',
                }}
              />
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            </div>
          </div>

          {filteredGuests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
              <User size={36} style={{ color: 'var(--color-gold-dark)', margin: '0 auto 0.75rem', opacity: 0.7 }} />
              <p style={{ margin: 0 }}>Chưa tìm thấy khách mời nào phù hợp.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredGuests.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.95rem 1.25rem',
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(213, 181, 140, 0.35)',
                    boxShadow: '0 2px 8px rgba(73, 52, 58, 0.03)',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'rgba(243, 213, 218, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-rose-dark)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-plum)' }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {getFullUrl(item.name)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.name)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.45rem 0.95rem',
                        borderRadius: 'var(--radius-full)',
                        background: copiedId === item.id ? 'var(--color-rose)' : 'rgba(213, 181, 140, 0.15)',
                        border: '1px solid rgba(213, 181, 140, 0.45)',
                        color: copiedId === item.id ? '#FFFFFF' : 'var(--color-plum)',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedId === item.id ? 'Đã Chép' : 'Chép Link'}</span>
                    </button>

                    <a
                      href={getFullUrl(item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Mở tab mới xem thử"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: '1px solid rgba(213, 181, 140, 0.45)',
                        color: 'var(--color-plum)',
                        background: 'transparent',
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={14} />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDeleteGuest(item.id)}
                      title="Xóa khỏi danh sách"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        color: '#D9534F',
                        background: 'rgba(217, 83, 79, 0.1)',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <footer style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
          <p style={{ margin: '0 0 0.5rem' }}>
            Thiệp Cưới Nam &amp; Hiệp © 2026. Chúc hai bạn có những kỷ niệm ngọt ngào và một ngày trọng đại trọn vẹn!
          </p>
          <Heart size={14} fill="var(--color-rose)" stroke="none" style={{ margin: '0 auto' }} />
        </footer>
      </div>
    </div>
  );
};
