import { weddingConfig } from '../config/weddingConfig';

export interface RsvpSubmission {
  id?: string;
  name: string;
  status: 'yes' | 'no';
  count: number;
  phone?: string;
  message?: string;
  submittedAt?: string;
  syncedToGoogleSheet?: boolean;
}

const STORAGE_KEY = 'wedding_rsvps';
const SCRIPT_URL_KEY = 'wedding_rsvp_script_url';

export const getSavedRsvpScriptUrl = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(SCRIPT_URL_KEY) || weddingConfig.rsvp?.scriptUrl || '';
};

export const setSavedRsvpScriptUrl = (url: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SCRIPT_URL_KEY, url.trim());
};

export const getSavedRsvps = (): RsvpSubmission[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const submitRsvp = async (
  data: Omit<RsvpSubmission, 'id' | 'submittedAt' | 'syncedToGoogleSheet'>
): Promise<{ success: boolean; synced: boolean; error?: string }> => {
  const timestamp = new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
  });

  const submission: RsvpSubmission = {
    ...data,
    id: `rsvp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    submittedAt: timestamp,
    syncedToGoogleSheet: false,
  };

  // 1. Always record in localStorage first
  const existing = getSavedRsvps();
  const updatedList = [submission, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.warn('Could not save RSVP to localStorage:', err);
  }

  // 2. Sync to Google Sheet via Google Apps Script Web App if URL is provided
  const scriptUrl = getSavedRsvpScriptUrl();
  let synced = false;

  if (scriptUrl) {
    try {
      const payload = {
        timestamp,
        name: data.name,
        status: data.status === 'yes' ? 'Chắc chắn tham dự' : 'Rất tiếc không thể đến',
        count: data.status === 'yes' ? data.count : 0,
        phone: data.phone || '',
        message: data.message || '',
        source: 'Thiệp cưới online Nam & Hiệp',
        sheetId: weddingConfig.rsvp?.googleSheetId || '18ZRmmnf7wJhgfRVMqxJewOLsps4IPV9J--CqG1lPtLo',
      };

      // Use mode: 'no-cors' so browser sends request without cross-origin blockage
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      synced = true;
      submission.syncedToGoogleSheet = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.warn('Error syncing RSVP to Google Sheet:', err);
    }
  }

  return { success: true, synced };
};

export const exportRsvpsToCsv = (): void => {
  const rsvps = getSavedRsvps();
  if (rsvps.length === 0) {
    alert('Chưa có phản hồi nào để xuất file.');
    return;
  }

  const headers = ['Thời Gian Gửi', 'Họ Và Tên', 'Trạng Thái', 'Số Lượng', 'Số Điện Thoại', 'Lời Nhắn Gửi'];
  const rows = rsvps.map((r) => [
    `"${r.submittedAt || ''}"`,
    `"${(r.name || '').replace(/"/g, '""')}"`,
    `"${r.status === 'yes' ? 'Tham dự' : 'Không tham dự'}"`,
    r.status === 'yes' ? r.count : 0,
    `"\t${r.phone || ''}"`, // \t to preserve leading 0 in Excel
    `"${(r.message || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `danh_sach_rsvp_nam_hiep_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
