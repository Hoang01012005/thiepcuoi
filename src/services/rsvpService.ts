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
const SYNC_CHANNEL_NAME = 'wedding_rsvps_sync_bus';

/**
 * Lấy URL Google Apps Script Web App đang hoạt động.
 * Tự động kiểm tra và ưu tiên URL hợp lệ (chứa script.google.com và /exec).
 */
export const getSavedRsvpScriptUrl = (): string => {
  if (typeof window === 'undefined') return '';
  const saved = localStorage.getItem(SCRIPT_URL_KEY);
  if (
    saved &&
    saved.trim().startsWith('https://script.google.com/macros/s/') &&
    saved.includes('/exec')
  ) {
    return saved.trim();
  }
  return weddingConfig.rsvp?.scriptUrl || '';
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

/**
 * Fetch live RSVP records directly from the shared Google Sheet.
 * Sử dụng cache-busting timestamp và no-store để dữ liệu luôn phản ánh mới nhất ngay lập tức.
 */
export const fetchRsvpsFromGoogleSheet = async (): Promise<RsvpSubmission[]> => {
  const sheetId = weddingConfig.rsvp?.googleSheetId || '14XYkzVS8oaFKs019xVBBOdNbgMWOgMtOOLYS6S7qPV4';
  const timestamp = Date.now();
  // Ưu tiên đọc từ trang tính 'Xác Nhận Tham Gia'
  const primaryUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent('Xác Nhận Tham Gia')}&_t=${timestamp}`;
  const fallbackUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&_t=${timestamp}`;

  try {
    let res = await fetch(primaryUrl, { cache: 'no-store' });
    if (!res.ok) {
      res = await fetch(fallbackUrl, { cache: 'no-store' });
    }
    if (!res.ok) return [];

    const text = await res.text();
    const cleanJson = text
      .replace(/^\/\*O_o\*\/\s*google\.visualization\.Query\.setResponse\(/, '')
      .replace(/\);?\s*$/, '');
    const data = JSON.parse(cleanJson);
    const rows = data.table?.rows || [];

    return rows
      .map((r: { c?: Array<{ v?: string | number; f?: string } | null> }, idx: number) => {
        const c = r.c || [];
        const timestamp = String(c[0]?.f || c[0]?.v || '').trim();
        const name = String(c[1]?.v || '').trim();
        const statusText = String(c[2]?.v || '').toLowerCase();
        const count = Math.max(1, Number(c[3]?.v) || 1);
        const phone = String(c[4]?.v || '').replace(/^'/, '').trim();
        const message = String(c[5]?.v || '').trim();

        // Bỏ qua dòng tiêu đề và dòng ghi nhận mở link (visit tracking)
        if (
          !name ||
          name.toLowerCase().includes('họ và tên') ||
          name.toLowerCase().includes('họ tên') ||
          name.toLowerCase() === 'name' ||
          statusText.includes('mở thiệp') ||
          statusText.includes('xem thiệp') ||
          (name.toLowerCase() === 'khách mời' && statusText.includes('trạng thái'))
        ) {
          return null;
        }

        const isNotAttending =
          statusText.includes('không') ||
          statusText.includes('no') ||
          statusText.includes('tiếc') ||
          statusText.includes('bận');
        const status: 'yes' | 'no' = isNotAttending ? 'no' : 'yes';

        return {
          id: `gs-${idx}-${encodeURIComponent(name)}`,
          name,
          status,
          count,
          phone,
          message,
          submittedAt: timestamp || 'Vừa xong',
          syncedToGoogleSheet: true,
        };
      })
      .filter((item: RsvpSubmission | null): item is RsvpSubmission => item !== null);
  } catch (err) {
    console.warn('Could not fetch RSVP list from Google Sheet:', err);
    return [];
  }
};

/**
 * Đồng bộ danh sách phản hồi từ Google Sheets với danh sách local storage.
 */
export const getAllUnifiedRsvps = async (): Promise<RsvpSubmission[]> => {
  const localList = getSavedRsvps();
  const remoteList = await fetchRsvpsFromGoogleSheet();

  if (remoteList.length === 0) {
    return localList;
  }

  // Remote list từ Google Sheet đóng vai trò là nguồn dữ liệu chuẩn
  const map = new Map<string, RsvpSubmission>();

  for (const item of remoteList) {
    const key = `${item.name.toLowerCase().trim()}_${(item.phone || '').trim()}`;
    map.set(key, item);
  }

  // Bổ sung các bản ghi local chưa kịp xuất hiện trong remote
  for (const item of localList) {
    const key = `${item.name.toLowerCase().trim()}_${(item.phone || '').trim()}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  const merged = Array.from(map.values());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {}

  return merged;
};

/**
 * Cross-tab and window real-time event broadcaster using BroadcastChannel & custom events
 */
export const broadcastRsvpUpdate = (submission?: RsvpSubmission): void => {
  if (typeof window === 'undefined') return;
  try {
    const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    channel.postMessage({ type: 'RSVP_UPDATED', submission });
    channel.close();
  } catch {}
  try {
    window.dispatchEvent(new CustomEvent('wedding_rsvps_updated', { detail: submission }));
  } catch {}
};

export const subscribeToRsvpUpdates = (callback: (updatedList: RsvpSubmission[]) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    channel.onmessage = () => {
      callback(getSavedRsvps());
    };
  } catch {}

  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getSavedRsvps());
    }
  };

  const customHandler = () => {
    callback(getSavedRsvps());
  };

  window.addEventListener('storage', storageHandler);
  window.addEventListener('wedding_rsvps_updated', customHandler);

  return () => {
    if (channel) channel.close();
    window.removeEventListener('storage', storageHandler);
    window.removeEventListener('wedding_rsvps_updated', customHandler);
  };
};

export const deleteSavedRsvp = (id: string): RsvpSubmission[] => {
  const current = getSavedRsvps();
  const updated = current.filter((r) => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
  broadcastRsvpUpdate();
  return updated;
};

export const clearAllRsvps = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch {}
  broadcastRsvpUpdate();
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

  // 1. Lưu tạm vào local storage
  const existing = getSavedRsvps();
  const updatedList = [submission, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.warn('Could not save RSVP to localStorage:', err);
  }

  // 2. Broadcast ngay lập tức cho các tab khác
  broadcastRsvpUpdate(submission);

  // 3. Đồng bộ vào Google Sheet qua Google Apps Script Web App
  const scriptUrl = getSavedRsvpScriptUrl();
  let synced = false;
  let syncError: string | undefined;

  if (scriptUrl) {
    try {
      const payload = {
        type: 'rsvp',
        timestamp,
        name: data.name,
        status: data.status === 'yes' ? 'Chắc chắn tham dự' : 'Rất tiếc không thể đến',
        count: data.status === 'yes' ? data.count : 0,
        phone: data.phone || '',
        message: data.message || '',
        source: 'Thiệp cưới online Đoàn Hiệp & Nguyễn Nam',
        sheetId: weddingConfig.rsvp?.googleSheetId || '14XYkzVS8oaFKs019xVBBOdNbgMWOgMtOOLYS6S7qPV4',
      };

      // Dùng Content-Type: text/plain;charset=utf-8 để gửi an toàn qua mode no-cors
      // Google Apps Script nhận đầy đủ chuỗi JSON trong e.postData.contents
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      synced = true;
      submission.syncedToGoogleSheet = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (err: any) {
      syncError = err?.message || 'Lỗi khi gửi yêu cầu tới Google Apps Script';
      console.warn('Error syncing RSVP to Google Sheet:', err);
    }
  } else {
    syncError = 'Chưa cấu hình URL Google Apps Script Web App';
  }

  return { success: true, synced, error: syncError };
};

/**
 * Tự động ghi nhận khi khách mời nhấp vào link thiệp riêng (?to=...)
 * Không ghi trùng lặp trong cùng một phiên duyệt web
 */
export const autoRecordGuestVisit = async (guestName: string): Promise<void> => {
  if (typeof window === 'undefined' || !guestName || !guestName.trim()) return;
  const cleanName = guestName.trim();

  // Chặn spam ghi đúp nhiều lần khi F5 hoặc mở lại cùng 1 phiên
  const sessionKey = `wedding_auto_visit_${cleanName.toLowerCase()}`;
  if (sessionStorage.getItem(sessionKey)) {
    return;
  }
  sessionStorage.setItem(sessionKey, '1');

  const timestamp = new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
  });

  const scriptUrl = getSavedRsvpScriptUrl();
  if (scriptUrl) {
    try {
      const payload = {
        type: 'visit',
        timestamp,
        name: cleanName,
        status: 'Đã mở thiệp / Xác nhận xem thiệp',
        count: 1,
        phone: '',
        message: 'Khách đã nhấp vào link mở xem thiệp cưới',
        source: 'Tự động ghi nhận khi khách mở link riêng (?to=...)',
        sheetId: weddingConfig.rsvp?.googleSheetId || '14XYkzVS8oaFKs019xVBBOdNbgMWOgMtOOLYS6S7qPV4',
      };

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Error auto-syncing guest visit to Google Sheet:', err);
    }
  }
};

export const exportRsvpsToCsv = (): void => {
  const rsvps = getSavedRsvps();
  if (rsvps.length === 0) {
    alert('Chưa có phản hồi nào để xuất file.');
    return;
  }

  const sanitizeCsvField = (val: string): string => {
    let escaped = (val || '').replace(/"/g, '""');
    if (/^[=+@-]/i.test(escaped.trim())) {
      escaped = `'${escaped}`;
    }
    return `"${escaped}"`;
  };

  const headers = ['Thời Gian Gửi', 'Họ Và Tên', 'Trạng Thái', 'Số Lượng', 'Số Điện Thoại', 'Lời Nhắn Gửi'];
  const rows = rsvps.map((r) => [
    sanitizeCsvField(r.submittedAt || ''),
    sanitizeCsvField(r.name || ''),
    `"${r.status === 'yes' ? 'Tham dự' : 'Không tham dự'}"`,
    r.status === 'yes' ? r.count : 0,
    `"\t${(r.phone || '').replace(/"/g, '""')}"`,
    sanitizeCsvField(r.message || ''),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `danh_sach_rsvp_doanhiep_nguyennam_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
