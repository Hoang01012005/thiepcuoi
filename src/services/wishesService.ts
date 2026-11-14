import { weddingConfig } from '../config/weddingConfig';
import { fetchSheetGviz, getGvizCellText, parseGvizResponseText, type GvizTable } from './gvizUtils';
import { getSavedRsvpScriptUrl } from './rsvpService';

export interface WishItem {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  createdAtMs?: number;
  syncedToGoogleSheet?: boolean;
}

export { parseGvizResponseText };

const STORAGE_KEY = 'wedding_wishes';
const SYNC_CHANNEL_NAME = 'wedding_wishes_sync_bus';
const WISH_STATUS_LABEL = 'Sổ lưu bút chúc phúc';
const WISH_SOURCE_LABEL = 'Sổ Lưu Bút Chúc Phúc';
const LEGACY_SAMPLE_IDS = new Set(['w-1', 'w-2', 'w-3']);
const PENDING_TTL_MS = 5 * 60 * 1000;
const MAX_WISHES = 200;
const DEFAULT_SHEET_ID = '14XYkzVS8oaFKs019xVBBOdNbgMWOgMtOOLYS6S7qPV4';

export const sanitizeWishText = (value: string, maxLength: number): string =>
  value.replace(/[<>]/g, '').trim().slice(0, maxLength);

export const normalizeWishKey = (name: string, message: string): string =>
  `${name.toLowerCase().trim().replace(/\s+/g, ' ')}::${message.toLowerCase().trim().replace(/\s+/g, ' ')}`;

const normalizeWishInstanceKey = (item: Pick<WishItem, 'name' | 'message' | 'createdAt'>): string =>
  `${normalizeWishKey(item.name, item.message)}::${item.createdAt.toLowerCase().trim()}`;

export const parseVietnameseTimestampMs = (value: string): number | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Format A: "dd/MM/yyyy HH:mm:ss" (or "dd/MM/yyyy")
  let match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (match) {
    const [, dd, mm, yyyy, hh = '0', mi = '0', ss = '0'] = match;
    const ms = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss)).getTime();
    return Number.isFinite(ms) ? ms : null;
  }

  // Format B: "HH:mm:ss dd/MM/yyyy" (produced by vi-VN toLocaleString)
  match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?[,\s]+(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, hh, mi, ss = '0', dd, mm, yyyy] = match;
    const ms = new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(mi), Number(ss)).getTime();
    return Number.isFinite(ms) ? ms : null;
  }

  const parsed = Date.parse(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Google Sheets gviz silently falls back to the first sheet ("Xác Nhận Tham Gia")
 * when a requested sheet name ("Sổ Lưu Bút") does not exist yet.
 * Inspect columns first (and first row only when headers were not promoted into cols).
 */
export const isRsvpTrackingTable = (table: GvizTable): boolean => {
  const cols = table.cols || [];
  const colLabels = cols.map((col) => (col.label || '').toLowerCase()).join(' ');
  if (
    cols.length >= 6 ||
    colLabels.includes('trạng thái') ||
    colLabels.includes('số lượng') ||
    colLabels.includes('số điện thoại')
  ) {
    return true;
  }

  // Dedicated "Sổ Lưu Bút" sheet has <= 5 columns and explicit labels without RSVP columns.
  if (colLabels.includes('lời chúc phúc') || (cols.length > 0 && cols.length <= 5 && colLabels.trim().length > 0)) {
    return false;
  }

  const firstRowText = (table.rows?.[0]?.c || [])
    .map((cell) => getGvizCellText(cell).toLowerCase())
    .join(' ');
  return firstRowText.includes('trạng thái') || firstRowText.includes('số lượng');
};

export const isTestSampleWish = (name: string, message: string): boolean => {
  const lowerName = name.toLowerCase().trim();
  const lowerMsg = message.toLowerCase().trim();
  if (
    lowerName.includes('(test') ||
    lowerName.includes('test kết nối') ||
    lowerName.includes('test tự động') ||
    lowerName === 'test connection sync' ||
    lowerName === 'test script status' ||
    lowerName === 'bác hùng (test kết nối)' ||
    lowerName === 'bạn lan (test tự động mở thiệp)' ||
    lowerName === 'bạn linh (test wish)' ||
    lowerName === 'khách mời' ||
    lowerName === 'aaaa'
  ) {
    return true;
  }
  if (
    lowerMsg === 'a' ||
    lowerMsg === 'aaa' ||
    lowerMsg === 'dasds' ||
    lowerMsg === 'testing sync' ||
    lowerMsg === 'testing current deployed script'
  ) {
    return true;
  }
  return false;
};

const isHeaderName = (lowerName: string): boolean =>
  lowerName.includes('họ và tên') ||
  lowerName.includes('họ tên') ||
  lowerName === 'name' ||
  lowerName === 'tên của bạn';

export const parseWishesFromGvizTable = (table: GvizTable, idPrefix = 'gs-wish'): WishItem[] => {
  const rows = table.rows || [];
  const isRsvpSchema = isRsvpTrackingTable(table);
  const parsed: WishItem[] = [];

  rows.forEach((row, idx) => {
    const c = row.c || [];
    const createdAt = getGvizCellText(c[0]);
    const rawName = getGvizCellText(c[1]);
    const cleanName = sanitizeWishText(rawName, 80);
    const lowerName = cleanName.toLowerCase();

    if (!cleanName || isHeaderName(lowerName)) {
      return;
    }

    let rawMessage = '';
    if (isRsvpSchema) {
      const statusText = getGvizCellText(c[2]).toLowerCase();
      if (
        statusText.includes('mở thiệp') ||
        statusText.includes('xem thiệp') ||
        (lowerName === 'khách mời' && statusText.includes('trạng thái'))
      ) {
        return;
      }

      // Column F (index 5) holds the guest's blessing/message in RSVP schema
      rawMessage = getGvizCellText(c[5]);
      const lowerMsg = rawMessage.toLowerCase();
      if (
        !rawMessage ||
        lowerMsg.includes('khách đã nhấp vào link') ||
        lowerMsg.includes('mở xem thiệp cưới') ||
        lowerMsg === 'lời chúc / lời nhắn' ||
        lowerMsg === 'lời chúc'
      ) {
        return;
      }
    } else {
      rawMessage = getGvizCellText(c[2]);
      const lowerMessage = rawMessage.toLowerCase();
      if (lowerMessage === 'lời chúc phúc' || lowerMessage === 'lời chúc') {
        return;
      }
    }

    if (isTestSampleWish(cleanName, rawMessage)) {
      return;
    }

    const cleanMessage = sanitizeWishText(rawMessage, 500);
    if (!cleanMessage) {
      return;
    }

    parsed.push({
      id: `${idPrefix}-${idx}-${encodeURIComponent(cleanName.slice(0, 24))}`,
      name: cleanName,
      message: cleanMessage,
      createdAt,
      syncedToGoogleSheet: true,
    });
  });

  // Google Sheets appends newest entries at the bottom; reverse so newest wishes appear first.
  const newestFirst = parsed.reverse();
  const seen = new Set<string>();
  return newestFirst.filter((item) => {
    const key = normalizeWishInstanceKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const getSavedWishes = (): WishItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: WishItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((w) => w && w.name && w.message && !LEGACY_SAMPLE_IDS.has(w.id) && !isTestSampleWish(w.name, w.message));
  } catch {
    return [];
  }
};

const saveWishesToLocalStorage = (wishes: WishItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes.slice(0, MAX_WISHES)));
  } catch {
    // Ignore storage quota/privacy-mode errors
  }
};

export const broadcastWishUpdate = (wish?: WishItem): void => {
  if (typeof window === 'undefined') return;
  try {
    const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    channel.postMessage({ type: 'WISHES_UPDATED', wish });
    channel.close();
  } catch {
    // BroadcastChannel unsupported
  }
  try {
    window.dispatchEvent(new CustomEvent('wedding_wishes_updated', { detail: wish }));
  } catch {
    // CustomEvent unsupported
  }
};

export const subscribeToWishUpdates = (callback: (updatedList: WishItem[]) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    channel.onmessage = () => {
      callback(getSavedWishes());
    };
  } catch {
    // BroadcastChannel unsupported
  }

  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getSavedWishes());
    }
  };

  const customHandler = () => {
    callback(getSavedWishes());
  };

  window.addEventListener('storage', storageHandler);
  window.addEventListener('wedding_wishes_updated', customHandler);

  return () => {
    if (channel) channel.close();
    window.removeEventListener('storage', storageHandler);
    window.removeEventListener('wedding_wishes_updated', customHandler);
  };
};

/**
 * Fetch shared guestbook wishes from Google Sheets.
 * Supports both the dedicated "Sổ Lưu Bút" sheet (3-sheet Apps Script)
 * and wish rows stored in "Xác Nhận Tham Gia" (2-sheet Apps Script).
 */
export const fetchWishesFromGoogleSheet = async (): Promise<{ wishes: WishItem[]; ok: boolean }> => {
  const sheetId = weddingConfig.rsvp?.googleSheetId || DEFAULT_SHEET_ID;

  try {
    const primaryTable = await fetchSheetGviz(sheetId, 'Sổ Lưu Bút');
    if (!primaryTable) {
      const fallbackTable = await fetchSheetGviz(sheetId, 'Xác Nhận Tham Gia');
      if (!fallbackTable) {
        return { wishes: [], ok: false };
      }
      return {
        wishes: parseWishesFromGvizTable(fallbackTable, 'gs-rsvp-wish'),
        ok: true,
      };
    }

    if (isRsvpTrackingTable(primaryTable)) {
      return {
        wishes: parseWishesFromGvizTable(primaryTable, 'gs-rsvp-wish'),
        ok: true,
      };
    }

    const dedicatedWishes = parseWishesFromGvizTable(primaryTable, 'gs-wish');
    let legacyWishes: WishItem[] = [];
    try {
      const rsvpTable = await fetchSheetGviz(sheetId, 'Xác Nhận Tham Gia');
      if (rsvpTable) {
        legacyWishes = parseWishesFromGvizTable(rsvpTable, 'gs-rsvp-wish');
      }
    } catch {
      // Dedicated sheet succeeded; ignore secondary lookup errors
    }

    const seen = new Set<string>();
    const combined = [...dedicatedWishes, ...legacyWishes].filter((item) => {
      const key = normalizeWishInstanceKey(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    combined.sort((a, b) => {
      const ta = parseVietnameseTimestampMs(a.createdAt);
      const tb = parseVietnameseTimestampMs(b.createdAt);
      if (ta !== null && tb !== null && ta !== tb) {
        return tb - ta;
      }
      return 0;
    });

    return { wishes: combined, ok: true };
  } catch (err) {
    console.warn('Could not fetch wishes from Google Sheet:', err);
    return { wishes: [], ok: false };
  }
};

export const mergeLocalAndRemoteWishes = (
  localList: WishItem[],
  remoteList: WishItem[],
  remoteOk: boolean,
  nowMs = Date.now()
): WishItem[] => {
  if (!remoteOk) {
    return localList;
  }

  const remoteKeys = new Set(remoteList.map((item) => normalizeWishKey(item.name, item.message)));
  const pendingLocal = localList.filter((item) => {
    if (item.createdAtMs === undefined) return false;
    if (remoteKeys.has(normalizeWishKey(item.name, item.message))) return false;
    // Preserve offline/failed submissions indefinitely; expire posted optimistic items after TTL
    // so host deletions in Google Sheet propagate cleanly.
    if (item.syncedToGoogleSheet === false) return true;
    return nowMs - item.createdAtMs <= PENDING_TTL_MS;
  });

  return [...pendingLocal, ...remoteList].slice(0, MAX_WISHES);
};

export const getAllUnifiedWishes = async (): Promise<{ wishes: WishItem[]; remoteSynced: boolean }> => {
  const { wishes: remoteList, ok } = await fetchWishesFromGoogleSheet();
  // Read localList after the network await so concurrent local submissions aren't lost.
  const localList = getSavedWishes();

  if (!ok) {
    return { wishes: localList, remoteSynced: false };
  }

  const merged = mergeLocalAndRemoteWishes(localList, remoteList, true);
  saveWishesToLocalStorage(merged);
  return { wishes: merged, remoteSynced: true };
};

export const submitWish = async (input: {
  name: string;
  message: string;
  justNowLabel?: string;
}): Promise<{ wish: WishItem | null; synced: boolean; error?: string }> => {
  const cleanName = sanitizeWishText(input.name, 80);
  const cleanMessage = sanitizeWishText(input.message, 500);
  if (!cleanName || !cleanMessage) {
    return {
      wish: null,
      synced: false,
      error: 'Vui lòng nhập tên và lời chúc hợp lệ',
    };
  }

  const timestamp = new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
  });

  const newWish: WishItem = {
    id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: cleanName,
    message: cleanMessage,
    createdAt: input.justNowLabel || '',
    createdAtMs: Date.now(),
    syncedToGoogleSheet: false,
  };

  const existing = getSavedWishes();
  const updatedList = [newWish, ...existing].slice(0, MAX_WISHES);
  saveWishesToLocalStorage(updatedList);
  broadcastWishUpdate(newWish);

  const scriptUrl = getSavedRsvpScriptUrl();
  if (!scriptUrl) {
    return {
      wish: newWish,
      synced: false,
      error: 'Chưa cấu hình URL Google Apps Script Web App',
    };
  }

  try {
    const payload = {
      type: 'wish',
      timestamp,
      name: cleanName,
      status: WISH_STATUS_LABEL,
      count: 0,
      phone: '',
      message: cleanMessage,
      source: WISH_SOURCE_LABEL,
      sheetId: weddingConfig.rsvp?.googleSheetId || DEFAULT_SHEET_ID,
    };

    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    newWish.syncedToGoogleSheet = true;
    const latestList = getSavedWishes();
    const nextList = latestList.some((w) => w.id === newWish.id)
      ? latestList.map((w) => (w.id === newWish.id ? { ...w, syncedToGoogleSheet: true } : w))
      : [newWish, ...latestList];
    saveWishesToLocalStorage(nextList);
    broadcastWishUpdate(newWish);
    return { wish: newWish, synced: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi khi gửi lời chúc tới Google Apps Script';
    console.warn('Error syncing wish to Google Sheet:', err);
    return { wish: newWish, synced: false, error: message };
  }
};
