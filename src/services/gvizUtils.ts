export interface GvizCell {
  v?: string | number | boolean | null;
  f?: string;
}

export interface GvizTable {
  cols?: Array<{ id?: string; label?: string; type?: string }>;
  rows?: Array<{ c?: Array<GvizCell | null> }>;
}

export interface GvizResponse {
  status?: string;
  table?: GvizTable;
}

const DEFAULT_FETCH_TIMEOUT_MS = 10000;

const pad2 = (n: number): string => String(n).padStart(2, '0');

export const formatGvizDateValue = (raw: string): string => {
  const match = raw.match(/^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)$/);
  if (!match) return raw;

  const year = Number(match[1]);
  const month = Number(match[2]) + 1;
  const day = Number(match[3]);
  const datePart = `${pad2(day)}/${pad2(month)}/${year}`;

  if (match[4] === undefined) {
    return datePart;
  }

  const hours = Number(match[4]);
  const minutes = Number(match[5] || 0);
  const seconds = Number(match[6] || 0);
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)} ${datePart}`;
};

export const getGvizCellText = (cell?: GvizCell | null): string => {
  if (!cell) return '';
  if (cell.f !== undefined && cell.f !== '') {
    return String(cell.f).trim();
  }
  if (cell.v !== undefined && cell.v !== null) {
    return formatGvizDateValue(String(cell.v).trim());
  }
  return '';
};

export const parseGvizResponseText = (text: string): GvizResponse | null => {
  try {
    const cleanJson = text
      .replace(/^\/\*O_o\*\/\s*google\.visualization\.Query\.setResponse\(/, '')
      .replace(/\);?\s*$/, '');
    const parsed = JSON.parse(cleanJson) as GvizResponse;
    if (parsed.status && parsed.status !== 'ok') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const fetchSheetGviz = async (
  sheetId: string,
  sheetName?: string,
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS
): Promise<GvizTable | null> => {
  const timestamp = Date.now();
  const sheetParam = sheetName ? `&sheet=${encodeURIComponent(sheetName)}` : '';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json${sheetParam}&_t=${timestamp}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const text = await res.text();
    const parsed = parseGvizResponseText(text);
    return parsed?.table || null;
  } finally {
    clearTimeout(timer);
  }
};
