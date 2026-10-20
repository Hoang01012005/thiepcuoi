import React, { useState, useEffect } from 'react';
import { weddingConfig } from '../../config/weddingConfig';
import {
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Heart,
  User,
  Search,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  MessageSquare,
  Send,
  Users,
  Code2,
} from 'lucide-react';
import {
  getSavedRsvps,
  getSavedRsvpScriptUrl,
  setSavedRsvpScriptUrl,
  submitRsvp,
  exportRsvpsToCsv,
  type RsvpSubmission,
} from '../../services/rsvpService';

interface ManagedGuest {
  id: string;
  name: string;
  createdAt: string;
}

const DEFAULT_CHIPS = ['Anh', 'Chị', 'Em', 'Bạn', 'Gia đình', 'Cô Chú', 'Bác'];

const APPS_SCRIPT_SNIPPET = `function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Thời Gian Gửi", "Họ Và Tên", "Trạng Thái Tham Dự", "Số Lượng Khách", "Số Điện Thoại", "Lời Chúc / Lời Nhắn", "Nguồn Gửi"]);
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setBackground("#F3D5DA");
      headerRange.setFontColor("#5A2D3A");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
    }
    var data = {};
    if (e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch (err) { data = e.parameter || {}; }
    } else { data = e.parameter || {}; }
    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    var name = data.name || "Khách mời";
    var status = data.status || "Chưa rõ";
    var count = data.count !== undefined ? data.count : 1;
    var phone = data.phone ? "'" + data.phone : "";
    var message = data.message || "";
    var source = data.source || "Thiệp cưới online Nam & Hiệp";
    sheet.appendRow([timestamp, name, status, count, phone, message, source]);
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 3).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 4).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 5).setHorizontalAlignment("center");
    return ContentService.createTextOutput(JSON.stringify({ result: "success", row: lastRow })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally { lock.releaseLock(); }
}`;

export const InviteGeneratorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'invite' | 'rsvp'>('invite');
  const [guestNameInput, setGuestNameInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // RSVP Management State
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>([]);
  const [scriptUrlInput, setScriptUrlInput] = useState('');
  const [isSavedScriptUrl, setIsSavedScriptUrl] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [showCodeGuide, setShowCodeGuide] = useState(false);

  // Load RSVP data & Script URL
  useEffect(() => {
    setRsvps(getSavedRsvps());
    setScriptUrlInput(getSavedRsvpScriptUrl());
  }, []);

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

    if (!guestList.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())) {
      const newGuest: ManagedGuest = {
        id: `g-${Date.now()}`,
        name: trimmed,
        createdAt: 'Vừa tạo',
      };
      setGuestList([newGuest, ...guestList]);
    }
    setGuestNameInput('');
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

  const handleSaveScriptUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedRsvpScriptUrl(scriptUrlInput);
    setIsSavedScriptUrl(true);
    setTimeout(() => setIsSavedScriptUrl(false), 2500);
  };

  const handleCopyAppsScript = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(APPS_SCRIPT_SNIPPET);
      }
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleTestSubmit = async () => {
    setTestSending(true);
    setTestSuccess(false);
    try {
      await submitRsvp({
        name: 'Khách Mời Thử Nghiệm',
        status: 'yes',
        count: 2,
        phone: '0901234567',
        message: 'Chúc mừng trăm năm hạnh phúc Nam & Hiệp!',
      });
      setRsvps(getSavedRsvps());
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 3500);
    } catch {
      // ignore
    } finally {
      setTestSending(false);
    }
  };

  const handleDeleteRsvp = (id?: string) => {
    if (!id) return;
    const updated = rsvps.filter((r) => r.id !== id);
    setRsvps(updated);
    localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
  };

  // RSVP statistics
  const attendingRsvps = rsvps.filter((r) => r.status === 'yes');
  const notAttendingRsvps = rsvps.filter((r) => r.status === 'no');
  const totalGuestsAttending = attendingRsvps.reduce((sum, r) => sum + (r.count || 1), 0);

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
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
            <span>Khu Vực Quản Trị Thiệp Cưới (Dành Riêng Cho Nam &amp; Hiệp)</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              color: 'var(--color-plum)',
              margin: '0 0 0.75rem',
            }}
          >
            Quản Lý Khách Mời &amp; Phản Hồi RSVP
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-muted)',
              maxWidth: '580px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Tạo link thiệp riêng cho từng khách và theo dõi phản hồi tham dự tự động đồng bộ vào Google Sheet.
          </p>
        </header>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('invite')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              border: activeTab === 'invite' ? '1px solid var(--color-rose)' : '1px solid rgba(213, 181, 140, 0.45)',
              background: activeTab === 'invite' ? 'var(--color-rose-dark)' : '#FFF9F6',
              color: activeTab === 'invite' ? '#FFF9F6' : 'var(--color-plum)',
              boxShadow: activeTab === 'invite' ? 'var(--shadow-md)' : 'none',
            }}
          >
            <Sparkles size={16} />
            <span>Tạo Link Khách Mời ({guestList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('rsvp');
              setRsvps(getSavedRsvps());
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              border: activeTab === 'rsvp' ? '1px solid var(--color-rose)' : '1px solid rgba(213, 181, 140, 0.45)',
              background: activeTab === 'rsvp' ? 'var(--color-rose-dark)' : '#FFF9F6',
              color: activeTab === 'rsvp' ? '#FFF9F6' : 'var(--color-plum)',
              boxShadow: activeTab === 'rsvp' ? 'var(--shadow-md)' : 'none',
            }}
          >
            <FileSpreadsheet size={16} />
            <span>Phản Hồi RSVP &amp; Google Sheet ({rsvps.length})</span>
          </button>
        </div>

        {/* TAB 1: INVITE LINK GENERATOR */}
        {activeTab === 'invite' && (
          <>
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
                        fontSize: '0.8rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(213, 181, 140, 0.45)',
                        background: 'rgba(255, 255, 255, 0.8)',
                        color: 'var(--color-plum)',
                        cursor: 'pointer',
                      }}
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleAddGuest} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 280px' }}>
                  <User
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-gold-dark)',
                    }}
                  />
                  <input
                    type="text"
                    value={guestNameInput}
                    onChange={(e) => setGuestNameInput(e.target.value)}
                    placeholder="Nhập tên khách (ví dụ: Gia đình Bác Hùng, Bạn Lan...)"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem 0.85rem 2.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-gold)',
                      background: '#FFF9F6',
                      color: 'var(--color-plum)',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!guestNameInput.trim()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.85rem 1.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: guestNameInput.trim() ? 'var(--color-rose-dark)' : '#D5C4BD',
                    color: '#FFF9F6',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: guestNameInput.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Plus size={18} />
                  <span>Tạo Link</span>
                </button>
              </form>
            </div>

            {/* Guest List Card */}
            <div
              className="stationery-card"
              style={{
                padding: 'clamp(2rem, 5vw, 2.85rem)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0, color: 'var(--color-plum)' }}>
                  Danh Sách Khách Mời ({guestList.length})
                </h2>

                <div style={{ position: 'relative', width: '220px' }}>
                  <Search
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-text-muted)',
                    }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên khách..."
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid rgba(213, 181, 140, 0.45)',
                      background: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {filteredGuests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
                  <p>Không tìm thấy khách mời nào phù hợp.</p>
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
                        padding: '0.9rem 1.15rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.75)',
                        border: '1px solid rgba(213, 181, 140, 0.35)',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-plum)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                          {getFullUrl(item.name)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.id, item.name)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--color-gold)',
                            background: copiedId === item.id ? 'var(--color-rose-dark)' : '#FFF9F6',
                            color: copiedId === item.id ? '#FFF9F6' : 'var(--color-plum)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
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
          </>
        )}

        {/* TAB 2: RSVP & GOOGLE SHEET SYNC */}
        {activeTab === 'rsvp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Google Sheet Direct Access Banner */}
            <div
              className="stationery-card"
              style={{
                padding: 'clamp(1.75rem, 4vw, 2.5rem)',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF6F2 100%)',
                border: '1px solid var(--color-gold)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: '#107C41',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(16, 124, 65, 0.25)',
                    }}
                  >
                    <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: 0, color: 'var(--color-plum)' }}>
                      Google Sheets Quản Lý RSVP
                    </h2>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      ID: {weddingConfig.rsvp.googleSheetId}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <a
                    href={weddingConfig.rsvp.googleSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.25rem',
                      borderRadius: 'var(--radius-full)',
                      background: '#107C41',
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      boxShadow: '0 3px 8px rgba(16, 124, 65, 0.3)',
                    }}
                  >
                    <span>Mở Bảng Tính Google Sheet</span>
                    <ExternalLink size={15} />
                  </a>

                  <button
                    type="button"
                    onClick={exportRsvpsToCsv}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.25rem',
                      borderRadius: 'var(--radius-full)',
                      background: '#FFF9F6',
                      border: '1px solid var(--color-gold)',
                      color: 'var(--color-plum)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Download size={15} />
                    <span>Xuất File Excel (.csv)</span>
                  </button>
                </div>
              </div>

              {/* Web App URL Config Form */}
              <div
                style={{
                  marginTop: '1.75rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px dashed rgba(213, 181, 140, 0.5)',
                }}
              >
                <form onSubmit={handleSaveScriptUrl} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-plum)' }}>
                    Đường dẫn Google Apps Script Web App (Tự động đẩy vào Sheet):
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                      type="url"
                      value={scriptUrlInput}
                      onChange={(e) => setScriptUrlInput(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      style={{
                        flex: '1 1 320px',
                        padding: '0.7rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-gold)',
                        background: '#FFFFFF',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.7rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: isSavedScriptUrl ? '#107C41' : 'var(--color-rose-dark)',
                        color: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isSavedScriptUrl ? <Check size={16} /> : <CheckCircle2 size={16} />}
                      <span>{isSavedScriptUrl ? 'Đã Lưu!' : 'Lưu Cấu Hình'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestSubmit}
                      disabled={testSending}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.7rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(213, 181, 140, 0.6)',
                        background: '#FFF9F6',
                        color: 'var(--color-plum)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        cursor: testSending ? 'wait' : 'pointer',
                      }}
                    >
                      <Send size={15} />
                      <span>{testSending ? 'Đang gửi...' : testSuccess ? 'Đã gửi thành công!' : 'Gửi Thử 1 Dòng Vào Sheet'}</span>
                    </button>
                  </div>
                </form>

                {/* Instructions toggle */}
                <div style={{ marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowCodeGuide(!showCodeGuide)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-rose-dark)',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Code2 size={15} />
                    <span>{showCodeGuide ? '▼ Ẩn mã và hướng dẫn Apps Script' : '▶ Xem mã Google Apps Script & Hướng dẫn 3 bước (30 giây)'}</span>
                  </button>

                  {showCodeGuide && (
                    <div
                      style={{
                        marginTop: '0.85rem',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        background: '#FAF2EC',
                        border: '1px solid rgba(213, 181, 140, 0.5)',
                        fontSize: '0.86rem',
                        lineHeight: 1.6,
                      }}
                    >
                      <ol style={{ paddingLeft: '1.25rem', margin: '0 0 1rem' }}>
                        <li>Mở file Google Sheet bằng nút xanh ở trên, vào menu <strong>Tiện ích mở rộng (Extensions)</strong> &gt; <strong>Apps Script</strong>.</li>
                        <li>Xóa sạch code mặc định, bấm nút <strong>Sao Chép Mã</strong> bên dưới rồi dán vào. Bấm <strong>Lưu (Ctrl+S)</strong>.</li>
                        <li>Bấm nút <strong>Triển khai (Deploy)</strong> màu xanh &gt; <strong>Triển khai mới (New deployment)</strong> &gt; Chọn loại <strong>Ứng dụng web (Web app)</strong> &gt; Ai có quyền truy cập: <strong>Bất kỳ ai (Anyone)</strong> &gt; Triển khai &gt; Sao chép URL dán vào ô bên trên.</li>
                      </ol>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={handleCopyAppsScript}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.4rem 0.85rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-gold)',
                            background: copiedScript ? '#107C41' : '#FFF9F6',
                            color: copiedScript ? '#FFFFFF' : 'var(--color-plum)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {copiedScript ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedScript ? 'Đã Chép Mã Apps Script!' : 'Sao Chép Mã Apps Script'}</span>
                        </button>
                      </div>

                      <pre
                        style={{
                          background: '#2B2327',
                          color: '#F4ECE6',
                          padding: '1rem',
                          borderRadius: '8px',
                          overflowX: 'auto',
                          fontSize: '0.78rem',
                          margin: 0,
                        }}
                      >
                        {APPS_SCRIPT_SNIPPET}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              <div
                className="stationery-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(201, 130, 145, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-rose-dark)',
                  }}
                >
                  <Users size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Tổng Lượt Phản Hồi</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-plum)' }}>
                    {rsvps.length}
                  </div>
                </div>
              </div>

              <div
                className="stationery-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(16, 124, 65, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#107C41',
                  }}
                >
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Chắc Chắn Tham Dự</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#107C41' }}>
                    {attendingRsvps.length} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>({totalGuestsAttending} khách)</span>
                  </div>
                </div>
              </div>

              <div
                className="stationery-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(217, 83, 79, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D9534F',
                  }}
                >
                  <XCircle size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Không Thể Tham Dự</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#D9534F' }}>
                    {notAttendingRsvps.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Submissions Table Card */}
            <div
              className="stationery-card"
              style={{
                padding: 'clamp(1.75rem, 4vw, 2.5rem)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0, color: 'var(--color-plum)' }}>
                  Danh Sách Phản Hồi Chi Tiết
                </h2>
                <button
                  type="button"
                  onClick={exportRsvpsToCsv}
                  disabled={rsvps.length === 0}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-rose-dark)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: rsvps.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: rsvps.length === 0 ? 0.6 : 1,
                  }}
                >
                  <Download size={14} />
                  <span>Tải Excel (.csv)</span>
                </button>
              </div>

              {rsvps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--color-text-muted)' }}>
                  <FileSpreadsheet size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                  <p style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 500 }}>Chưa có khách mời nào gửi phản hồi.</p>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>Các phản hồi từ thiệp cưới sẽ tự động xuất hiện tại đây và đồng bộ vào Google Sheet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {rsvps.map((rsvp, idx) => (
                    <div
                      key={rsvp.id || idx}
                      style={{
                        padding: '1.1rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.85)',
                        border: '1px solid rgba(213, 181, 140, 0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-plum)' }}>
                            {rsvp.name}
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.2rem 0.65rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              background: rsvp.status === 'yes' ? 'rgba(16, 124, 65, 0.15)' : 'rgba(217, 83, 79, 0.15)',
                              color: rsvp.status === 'yes' ? '#107C41' : '#D9534F',
                            }}
                          >
                            {rsvp.status === 'yes' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                            <span>{rsvp.status === 'yes' ? `Tham dự (${rsvp.count} người)` : 'Không tham dự'}</span>
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={13} />
                            {rsvp.submittedAt}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteRsvp(rsvp.id)}
                            title="Xóa phản hồi này"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#D9534F',
                              cursor: 'pointer',
                              padding: '0.2rem',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {rsvp.phone && (
                        <div style={{ fontSize: '0.84rem', color: 'var(--color-plum)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={13} style={{ color: 'var(--color-rose-dark)' }} />
                          <span>{rsvp.phone}</span>
                        </div>
                      )}

                      {rsvp.message && (
                        <div
                          style={{
                            fontSize: '0.88rem',
                            fontStyle: 'italic',
                            color: 'var(--color-plum)',
                            background: '#FFF9F6',
                            padding: '0.6rem 0.85rem',
                            borderRadius: '8px',
                            borderLeft: '3px solid var(--color-rose)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.45rem',
                          }}
                        >
                          <MessageSquare size={14} style={{ color: 'var(--color-rose)', flexShrink: 0, marginTop: '0.2rem' }} />
                          <span>"{rsvp.message}"</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
