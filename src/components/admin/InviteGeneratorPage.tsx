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
  RefreshCw,
  Share2,
  MessageCircle,
  Utensils,
  Calculator,
  ListPlus,
  X,
} from 'lucide-react';
import {
  getSavedRsvps,
  getSavedRsvpScriptUrl,
  setSavedRsvpScriptUrl,
  submitRsvp,
  exportRsvpsToCsv,
  getAllUnifiedRsvps,
  subscribeToRsvpUpdates,
  deleteSavedRsvp,
  type RsvpSubmission,
} from '../../services/rsvpService';

interface ManagedGuest {
  id: string;
  name: string;
  createdAt: string;
}

type MessageTone = 'elder' | 'friend' | 'formal' | 'reminder';

interface MessageTemplateConfig {
  id: MessageTone;
  label: string;
  icon: string;
  badge: string;
  generate: (guestName: string, url: string) => string;
}

const DEFAULT_CHIPS = ['Anh', 'Chị', 'Em', 'Bạn', 'Gia đình', 'Cô Chú', 'Bác'];

const INVITE_TEMPLATES: MessageTemplateConfig[] = [
  {
    id: 'elder',
    label: 'Kính Gửi Bác / Cô / Chú',
    icon: '🏛️',
    badge: 'Trang trọng & Lễ phép',
    generate: (name, url) =>
      `Dạ cháu Đoàn Hiệp và Nguyễn Nam xin kính chào ${name} ạ!\n\nNhân dịp ngày vui trọng đại của hai cháu, gia đình cùng hai cháu xin trân trọng gửi thiệp cưới online kính mời ${name} và gia đình đến chung vui cùng chúng cháu.\n\nKính mời ${name} xem thông tin chi tiết ngày giờ và địa điểm tại thiệp cưới riêng:\n👉 ${url}\n\nSự hiện diện và lời chúc phúc của ${name} cùng gia đình là niềm vinh hạnh và hạnh phúc lớn nhất của chúng cháu ạ!`,
  },
  {
    id: 'formal',
    label: 'Kính Gửi Anh / Chị / Đối Tác',
    icon: '🌸',
    badge: 'Lịch sự & Ấm áp',
    generate: (name, url) =>
      `Em Đoàn Hiệp và Nguyễn Nam xin gửi lời chào trân trọng đến ${name}!\n\nNhân ngày hạnh phúc trăm năm của hai em, chúng em xin trân trọng kính mời ${name} bớt chút thời gian quý báu đến tham dự lễ thành hôn và chung vui bữa cơm thân mật cùng hai đứa.\n\nThông tin chi tiết thời gian và địa điểm tại thiệp cưới:\n👉 ${url}\n\nRất mong được đón tiếp ${name} trong ngày vui của chúng em!`,
  },
  {
    id: 'friend',
    label: 'Bạn Bè & Đồng Nghiệp',
    icon: '🎉',
    badge: 'Thân mật & Trẻ trung',
    generate: (name, url) =>
      `Alo ${name} ơi! Đoàn Hiệp và Nguyễn Nam chính thức về chung một nhà rồi đây! 🎉\n\nChúng mình trân trọng gửi thiệp cưới online tới ${name}, mở link xem chi tiết nhé:\n👉 ${url}\n\nNhớ giữ lịch ngày 28 & 29/11/2026 để đến quẩy cùng tụi mình nha! Báo lại số lượng tham dự trên thiệp sớm giúp chúng mình chuẩn bị chu đáo nhé!`,
  },
  {
    id: 'reminder',
    label: 'Nhắc Hẹn Save-the-Date',
    icon: '⏰',
    badge: 'Nhắc hẹn trước tiệc',
    generate: (name, url) =>
      `Dạ ${name} ơi, chỉ còn ít ngày nữa là đến lễ cưới của Đoàn Hiệp & Nguyễn Nam (28 & 29/11/2026) rồi ạ!\n\nChúng mình xin phép gửi lại link thiệp cưới để ${name} tiện xem lại lịch trình và chỉ đường trên bản đồ nhé:\n👉 ${url}\n\nRất mong được gặp và đón tiếp ${name} vào ngày vui sắp tới!`,
  },
];

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
    var source = data.source || "Thiệp cưới online Đoàn Hiệp & Nguyễn Nam";
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

  // Bulk input mode
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
  const [bulkInputText, setBulkInputText] = useState('');

  // 1-Click Message Assistant Modal State
  const [selectedGuestForMessage, setSelectedGuestForMessage] = useState<ManagedGuest | null>(null);
  const [selectedTone, setSelectedTone] = useState<MessageTone>('elder');
  const [customMessageText, setCustomMessageText] = useState('');
  const [copiedMessageToast, setCopiedMessageToast] = useState(false);

  // Table estimator capacity (6: traditional northern table, 10: round banquet table)
  const [tableCapacity, setTableCapacity] = useState<6 | 10>(6);

  // RSVP Management State
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>([]);
  const [scriptUrlInput, setScriptUrlInput] = useState('');
  const [isSavedScriptUrl, setIsSavedScriptUrl] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [showCodeGuide, setShowCodeGuide] = useState(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Sync live from Google Sheet and merge with local cache
  const handleSyncWithGoogleSheet = async (showToast = true) => {
    setIsSyncingSheet(true);
    try {
      const unified = await getAllUnifiedRsvps();
      setRsvps(unified);
      if (showToast) {
        setSyncFeedback(`Đã đồng bộ thành công (${unified.length} phản hồi)`);
        setTimeout(() => setSyncFeedback(null), 3000);
      }
    } catch (err) {
      console.warn('Sync error:', err);
      if (showToast) {
        setSyncFeedback('Không thể kết nối đến Google Sheet lúc này');
        setTimeout(() => setSyncFeedback(null), 3000);
      }
    } finally {
      setIsSyncingSheet(false);
    }
  };

  // Load RSVP data, Script URL, and subscribe to real-time sync
  useEffect(() => {
    setRsvps(getSavedRsvps());
    setScriptUrlInput(getSavedRsvpScriptUrl());

    // Automatically sync in background from Google Sheet on mount
    handleSyncWithGoogleSheet(false);

    // Listen to real-time events across all tabs/windows
    const unsubscribe = subscribeToRsvpUpdates((updated) => {
      setRsvps(updated);
    });

    return () => {
      unsubscribe();
    };
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

  const handleBulkAddGuests = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInputText.trim()) return;

    const lines = bulkInputText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) return;

    const existingNames = new Set(guestList.map((g) => g.name.toLowerCase()));
    const newGuests: ManagedGuest[] = [];

    lines.forEach((name, idx) => {
      if (!existingNames.has(name.toLowerCase())) {
        existingNames.add(name.toLowerCase());
        newGuests.push({
          id: `g-bulk-${Date.now()}-${idx}`,
          name,
          createdAt: 'Hàng loạt',
        });
      }
    });

    if (newGuests.length > 0) {
      setGuestList([...newGuests, ...guestList]);
      setBulkInputText('');
      setAddMode('single');
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

  // Export Guest Links to CSV
  const handleExportGuestLinks = () => {
    if (guestList.length === 0) return;

    const headers = ['STT', 'Họ Và Tên Khách Mời', 'Link Thiệp Riêng (Click để mở)', 'Ngày Tạo'];
    const rows = guestList.map((guest, idx) => [
      idx + 1,
      `"${guest.name.replace(/"/g, '""')}"`,
      `"${getFullUrl(guest.name)}"`,
      `"${guest.createdAt}"`,
    ]);

    const csvContent = '﻿' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const now = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `danh_sach_link_thiep_doanhiep_nguyennam_${now}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 1-Click Message Assistant Handlers
  const handleOpenMessageModal = (guest: ManagedGuest) => {
    setSelectedGuestForMessage(guest);
    setSelectedTone('elder');
    const tmpl = INVITE_TEMPLATES.find((t) => t.id === 'elder') || INVITE_TEMPLATES[0];
    setCustomMessageText(tmpl.generate(guest.name, getFullUrl(guest.name)));
    setCopiedMessageToast(false);
  };

  const handleSelectTone = (tone: MessageTone) => {
    if (!selectedGuestForMessage) return;
    setSelectedTone(tone);
    const tmpl = INVITE_TEMPLATES.find((t) => t.id === tone) || INVITE_TEMPLATES[0];
    setCustomMessageText(tmpl.generate(selectedGuestForMessage.name, getFullUrl(selectedGuestForMessage.name)));
  };

  const handleCopyMessage = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(customMessageText);
      } else {
        const ta = document.createElement('textarea');
        ta.value = customMessageText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedMessageToast(true);
      setTimeout(() => setCopiedMessageToast(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleOpenZalo = async () => {
    await handleCopyMessage();
    window.open('https://chat.zalo.me/', '_blank');
  };

  const handleNativeShare = async () => {
    if (!selectedGuestForMessage) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Thiệp Cưới Đoàn Hiệp & Nguyễn Nam - Kính gửi ${selectedGuestForMessage.name}`,
          text: customMessageText,
          url: getFullUrl(selectedGuestForMessage.name),
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyMessage();
    }
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
        message: 'Chúc mừng trăm năm hạnh phúc Đoàn Hiệp & Nguyễn Nam!',
      });
      await handleSyncWithGoogleSheet(false);
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
    const updated = deleteSavedRsvp(id);
    setRsvps(updated);
  };

  // RSVP statistics
  const attendingRsvps = rsvps.filter((r) => r.status === 'yes');
  const notAttendingRsvps = rsvps.filter((r) => r.status === 'no');
  const totalGuestsAttending = attendingRsvps.reduce((sum, r) => sum + (r.count || 1), 0);

  // Catering Estimator metrics
  const mainTables = Math.ceil(totalGuestsAttending / tableCapacity);
  const bufferTables = totalGuestsAttending > 0 ? Math.max(1, Math.ceil(mainTables * 0.1)) : 0;
  const totalTables = mainTables + bufferTables;
  const remainderGuests = totalGuestsAttending % tableCapacity;

  // Export Catering & Table Report to CSV
  const handleExportCateringReport = () => {
    const lines = [
      '﻿BÁO CÁO DỰ TRÙ VÀ CHỐT MÂM CỖ CƯỚI - ĐOÀN HIỆP & NGUYỄN NAM',
      `Thời gian xuất báo cáo:,"${new Date().toLocaleString('vi-VN')}"`,
      `Tiêu chuẩn bàn tiệc:,"${tableCapacity} người / mâm (${tableCapacity === 6 ? 'Cỗ Miền Bắc truyền thống' : 'Bàn tiệc tròn'})"`,
      `Tổng số khách chốt tham dự:,${totalGuestsAttending} khách`,
      `Số mâm cỗ chính cần phục vụ:,${mainTables} mâm`,
      `Số mâm cỗ dự phòng (+10% an toàn):,${bufferTables} mâm`,
      `TỔNG SỐ MÂM CỖ CẦN ĐẶT NẤU:,${totalTables} mâm`,
      '',
      'DANH SÁCH CHI TIẾT KHÁCH XÁC NHẬN THAM DỰ:',
      'STT,Họ và Tên,Số Lượng Đi Cùng,Số Điện Thoại,Lời Nhắn / Lời Chúc,Thời Gian Xác Nhận',
    ];

    attendingRsvps.forEach((r, idx) => {
      lines.push(
        [
          idx + 1,
          `"${r.name.replace(/"/g, '""')}"`,
          r.count || 1,
          r.phone ? `"	${r.phone}"` : '""',
          `"${(r.message || '').replace(/"/g, '""')}"`,
          `"${r.submittedAt}"`,
        ].join(',')
      );
    });

    const csvContent = lines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const now = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `bao_cao_chot_mam_co_doanhiep_nguyennam_${now}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
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
            <span>Khu Vực Quản Trị Thiệp Cưới (Dành Riêng Cho Đoàn Hiệp &amp; Nguyễn Nam)</span>
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
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Tạo link thiệp riêng, trợ lý soạn tin nhắn 1-chạm gửi Zalo/SMS và dự trù số mâm cỗ tiệc cưới tự động.
          </p>
        </header>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
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
            <span>Tạo Link &amp; Soạn Tin ({guestList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('rsvp');
              handleSyncWithGoogleSheet(false);
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
            <span>RSVP &amp; Dự Trù Mâm Cỗ ({rsvps.length})</span>
          </button>
        </div>

        {/* TAB 1: INVITE LINK GENERATOR & 1-CLICK ASSISTANT */}
        {activeTab === 'invite' && (
          <>
            {/* Generator Card */}
            <div
              className="stationery-card"
              style={{
                padding: 'clamp(1.75rem, 5vw, 2.5rem)',
                marginBottom: '2.5rem',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Sparkles size={22} style={{ color: 'var(--color-gold-dark)' }} />
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0, color: 'var(--color-plum)' }}>
                    {addMode === 'single' ? 'Tạo Link Thiệp Mời Riêng' : 'Thêm Danh Sách Khách Hàng Loạt'}
                  </h2>
                </div>

                {/* Mode Switcher */}
                <div style={{ display: 'flex', background: 'rgba(213, 181, 140, 0.2)', padding: '3px', borderRadius: 'var(--radius-full)' }}>
                  <button
                    type="button"
                    onClick={() => setAddMode('single')}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: addMode === 'single' ? '#FFF9F6' : 'transparent',
                      color: addMode === 'single' ? 'var(--color-rose-dark)' : 'var(--color-text-muted)',
                      boxShadow: addMode === 'single' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    Từng khách
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddMode('bulk')}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: addMode === 'bulk' ? '#FFF9F6' : 'transparent',
                      color: addMode === 'bulk' ? 'var(--color-rose-dark)' : 'var(--color-text-muted)',
                      boxShadow: addMode === 'bulk' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    <ListPlus size={14} />
                    <span>Dán hàng loạt</span>
                  </button>
                </div>
              </div>

              {addMode === 'single' ? (
                <>
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
                </>
              ) : (
                /* Bulk Add Form */
                <form onSubmit={handleBulkAddGuests} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    Dán danh sách tên khách mời vào ô bên dưới (<strong>mỗi dòng 1 tên khách</strong>, ví dụ: <em>Bác Ba, Cô Bảy, Bạn Tuấn Anh</em>). Hệ thống sẽ tự động tạo link riêng cho tất cả trong 1 giây.
                  </p>
                  <textarea
                    rows={5}
                    value={bulkInputText}
                    onChange={(e) => setBulkInputText(e.target.value)}
                    placeholder="Gia đình Bác Hùng&#10;Gia đình Cô Mai&#10;Anh Hoàng & Bạn gái&#10;Bạn Thảo My&#10;Tập thể phòng Kế toán"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-gold)',
                      background: '#FFF9F6',
                      color: 'var(--color-plum)',
                      fontSize: '0.92rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      lineHeight: 1.6,
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setBulkInputText('');
                        setAddMode('single');
                      }}
                      style={{
                        padding: '0.65rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(213, 181, 140, 0.5)',
                        background: '#FFF9F6',
                        color: 'var(--color-plum)',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                      }}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={!bulkInputText.trim()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.65rem 1.4rem',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: bulkInputText.trim() ? 'var(--color-rose-dark)' : '#D5C4BD',
                        color: '#FFF9F6',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: bulkInputText.trim() ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <ListPlus size={16} />
                      <span>Thêm Toàn Bộ Vào Danh Sách</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Guest List Card */}
            <div
              className="stationery-card"
              style={{
                padding: 'clamp(1.75rem, 5vw, 2.5rem)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0, color: 'var(--color-plum)' }}>
                    Danh Sách Khách Mời ({guestList.length})
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Bấm <strong>"💬 Soạn Tin"</strong> để lấy mẫu tin nhắn Zalo/SMS chuẩn lịch sự kèm link thiệp riêng
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', width: '200px' }}>
                    <Search
                      size={15}
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
                        padding: '0.45rem 0.75rem 0.45rem 2.15rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(213, 181, 140, 0.45)',
                        background: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.82rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleExportGuestLinks}
                    disabled={guestList.length === 0}
                    title="Xuất toàn bộ link khách mời sang file Excel (.csv)"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem 0.95rem',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-gold)',
                      background: '#FFF9F6',
                      color: 'var(--color-plum)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: guestList.length === 0 ? 'not-allowed' : 'pointer',
                      opacity: guestList.length === 0 ? 0.6 : 1,
                    }}
                  >
                    <Download size={14} />
                    <span>Xuất File Link (.csv)</span>
                  </button>
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
                      <div style={{ flex: '1 1 240px', minWidth: '180px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.98rem', color: 'var(--color-plum)' }}>
                          {item.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            marginTop: '0.15rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '360px',
                          }}
                        >
                          {getFullUrl(item.name)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        {/* 1-Click Message Assistant Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenMessageModal(item)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.45rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--color-rose)',
                            background: 'rgba(201, 130, 145, 0.12)',
                            color: 'var(--color-rose-dark)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <MessageCircle size={14} />
                          <span>Soạn Tin</span>
                        </button>

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
                          title="Mở tab mới xem thử giao diện khách nhận"
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

        {/* TAB 2: RSVP & WEDDING CATERING ESTIMATOR */}
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

            {/* Wedding Catering & Table Estimator Card */}
            <div
              className="stationery-card"
              style={{
                padding: 'clamp(1.75rem, 4vw, 2.25rem)',
                background: 'linear-gradient(135deg, #FFFDFB 0%, #FBF3EE 100%)',
                border: '1px solid rgba(213, 181, 140, 0.7)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(184, 134, 11, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-gold-dark)',
                    }}
                  >
                    <Utensils size={22} />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0, color: 'var(--color-plum)' }}>
                      Dự Trù &amp; Chốt Mâm Cỗ Tiệc Cưới
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      Tự động tính toán số mâm chính và số mâm dự phòng an toàn theo phản hồi RSVP
                    </span>
                  </div>
                </div>

                {/* Capacity Selector Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    Tiêu chuẩn:
                  </span>
                  <div style={{ display: 'flex', background: 'rgba(213, 181, 140, 0.25)', padding: '3px', borderRadius: 'var(--radius-full)' }}>
                    <button
                      type="button"
                      onClick={() => setTableCapacity(6)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: tableCapacity === 6 ? '#FFF9F6' : 'transparent',
                        color: tableCapacity === 6 ? 'var(--color-rose-dark)' : 'var(--color-text-muted)',
                        boxShadow: tableCapacity === 6 ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      6 người / mâm (Miền Bắc)
                    </button>
                    <button
                      type="button"
                      onClick={() => setTableCapacity(10)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: tableCapacity === 10 ? '#FFF9F6' : 'transparent',
                        color: tableCapacity === 10 ? 'var(--color-rose-dark)' : 'var(--color-text-muted)',
                        boxShadow: tableCapacity === 10 ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      10 người / mâm (Bàn tròn)
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Calculation Metrics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#FFFFFF',
                    border: '1px solid rgba(213, 181, 140, 0.4)',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Khách Chắc Chắn Đi
                  </div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#107C41', marginTop: '0.2rem' }}>
                    {totalGuestsAttending}
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>khách</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                    Từ {attendingRsvps.length} lượt gửi xác nhận
                  </div>
                </div>

                <div
                  style={{
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#FFFFFF',
                    border: '1px solid rgba(213, 181, 140, 0.4)',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Mâm Cỗ Chính
                  </div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--color-plum)', marginTop: '0.2rem' }}>
                    {mainTables}
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>mâm</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                    {remainderGuests > 0 ? `Lẻ ${remainderGuests} khách xếp thêm` : 'Đủ trọn vẹn số mâm'}
                  </div>
                </div>

                <div
                  style={{
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#FFFFFF',
                    border: '1px solid rgba(213, 181, 140, 0.4)',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Dự Phòng (+10%)
                  </div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--color-gold-dark)', marginTop: '0.2rem' }}>
                    +{bufferTables}
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>mâm</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                    Đề phòng khách phát sinh
                  </div>
                </div>

                <div
                  style={{
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, rgba(201, 130, 145, 0.15) 0%, rgba(213, 181, 140, 0.25) 100%)',
                    border: '1px solid var(--color-rose)',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-rose-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tổng Mâm Chốt Đặt
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-rose-dark)', marginTop: '0.2rem' }}>
                    {totalTables}
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-plum)', marginLeft: '0.35rem' }}>mâm</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-plum)', marginTop: '0.35rem', fontWeight: 500 }}>
                    Số lượng gửi bên làm cỗ
                  </div>
                </div>
              </div>

              {/* Catering Advice & Export */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px dashed rgba(213, 181, 140, 0.5)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', maxWidth: '520px' }}>
                  <Calculator size={16} style={{ color: 'var(--color-gold-dark)', flexShrink: 0 }} />
                  <span>
                    Tiêu chuẩn <strong>{tableCapacity} người/mâm</strong> phù hợp nhất cho Tiệc Mừng tại Tư Gia Nhà Gái (Hùng Huyền Home) ngày 28/11/2026.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleExportCateringReport}
                  disabled={attendingRsvps.length === 0}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-plum)',
                    color: '#FFF9F6',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: attendingRsvps.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: attendingRsvps.length === 0 ? 0.6 : 1,
                    boxShadow: '0 3px 8px rgba(90, 45, 58, 0.25)',
                  }}
                >
                  <Download size={15} />
                  <span>Xuất Báo Cáo Chốt Mâm Cỗ (.csv)</span>
                </button>
              </div>
            </div>

            {/* Submissions Table Card */}
            <div
              className="stationery-card"
              style={{
                padding: 'clamp(1.75rem, 4vw, 2.5rem)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0, color: 'var(--color-plum)' }}>
                    Danh Sách Phản Hồi Chi Tiết
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.35rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#107C41' }}></span>
                    <span>Tự động đồng bộ với Google Sheet — Mọi thiệp &amp; thiết bị đều xem cùng một danh sách</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleSyncWithGoogleSheet(true)}
                    disabled={isSyncingSheet}
                    title="Đồng bộ lại danh sách từ Google Sheet"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.95rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(213, 181, 140, 0.22)',
                      border: '1px solid rgba(213, 181, 140, 0.55)',
                      color: 'var(--color-plum)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: isSyncingSheet ? 'wait' : 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <RefreshCw
                      size={14}
                      style={{
                        animation: isSyncingSheet ? 'spin 1s linear infinite' : 'none',
                      }}
                    />
                    <span>{isSyncingSheet ? 'Đang tải...' : 'Làm mới / Đồng bộ Sheet'}</span>
                  </button>

                  <a
                    href={weddingConfig.rsvp.googleSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.95rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(16, 124, 65, 0.1)',
                      border: '1px solid rgba(16, 124, 65, 0.3)',
                      color: '#107C41',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={14} />
                    <span>Mở Google Sheet</span>
                  </a>

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
              </div>

              {syncFeedback && (
                <div
                  style={{
                    marginBottom: '1.25rem',
                    padding: '0.6rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: syncFeedback.includes('thành công') ? 'rgba(16, 124, 65, 0.12)' : 'rgba(217, 83, 79, 0.12)',
                    color: syncFeedback.includes('thành công') ? '#107C41' : '#D9534F',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{syncFeedback}</span>
                </div>
              )}

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

        {/* Floating 1-Click Message Assistant Modal */}
        {selectedGuestForMessage && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(43, 35, 39, 0.65)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setSelectedGuestForMessage(null)}
          >
            <div
              className="stationery-card"
              style={{
                width: '100%',
                maxWidth: '560px',
                background: '#FFFDFB',
                padding: 'clamp(1.5rem, 4vw, 2.25rem)',
                position: 'relative',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--color-gold)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-gold-dark)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '0.35rem',
                    }}
                  >
                    <Sparkles size={14} />
                    <span>Trợ Lý Soạn Tin Nhắn 1-Chạm</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.45rem',
                      margin: 0,
                      color: 'var(--color-plum)',
                    }}
                  >
                    Gửi Thiệp Cho: {selectedGuestForMessage.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedGuestForMessage(null)}
                  style={{
                    background: 'rgba(213, 181, 140, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-plum)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tone Selection Tabs */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Chọn giọng điệu phù hợp với khách mời:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {INVITE_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTone(tmpl.id)}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: selectedTone === tmpl.id ? '1.5px solid var(--color-rose)' : '1px solid rgba(213, 181, 140, 0.5)',
                        background: selectedTone === tmpl.id ? 'rgba(201, 130, 145, 0.12)' : '#FFFFFF',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-plum)' }}>
                        <span>{tmpl.icon}</span>
                        <span>{tmpl.label}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                        {tmpl.badge}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Editor / Preview */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-plum)' }}>
                    Nội dung tin nhắn (Có thể chỉnh sửa thêm):
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                    {customMessageText.length} ký tự
                  </span>
                </div>

                <textarea
                  rows={8}
                  value={customMessageText}
                  onChange={(e) => setCustomMessageText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-gold)',
                    background: '#FFFFFF',
                    color: 'var(--color-plum)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Toast Feedback */}
              {copiedMessageToast && (
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 124, 65, 0.12)',
                    color: '#107C41',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <Check size={15} />
                  <span>Đã sao chép tin nhắn vào khay nhớ tạm! Giờ bạn có thể dán ngay vào tin nhắn.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-rose)',
                      background: '#FFF9F6',
                      color: 'var(--color-rose-dark)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Copy size={16} />
                    <span>Sao Chép Tin Nhắn</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenZalo}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: '#0068FF',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 3px 8px rgba(0, 104, 255, 0.25)',
                    }}
                  >
                    <Send size={15} />
                    <span>Mở Zalo Gửi Ngay</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'var(--color-rose-dark)',
                    color: '#FFF9F6',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Share2 size={16} />
                  <span>Chia Sẻ Qua Điện Thoại (SMS / Messenger)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <footer style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
          <p style={{ margin: '0 0 0.5rem' }}>
            Thiệp Cưới Đoàn Hiệp &amp; Nguyễn Nam © 2026. Chúc hai bạn có những kỷ niệm ngọt ngào và một ngày trọng đại trọn vẹn!
          </p>
          <Heart size={14} fill="var(--color-rose)" stroke="none" style={{ margin: '0 auto' }} />
        </footer>
      </div>
    </div>
  );
};
