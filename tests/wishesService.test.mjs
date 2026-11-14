import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { rolldown } from 'rolldown';

const repoRoot = process.cwd();
const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'thiepcuoi-tests-'));

const bundle = await rolldown({
  input: [
    path.join(repoRoot, 'src/services/wishesService.ts'),
    path.join(repoRoot, 'src/services/rsvpService.ts'),
    path.join(repoRoot, 'src/services/gvizUtils.ts'),
  ],
});
await bundle.write({
  dir: tmpDir,
  format: 'esm',
  entryFileNames: '[name].mjs',
});
await bundle.close();

const wishesMod = await import(pathToFileURL(path.join(tmpDir, 'wishesService.mjs')).href);
const rsvpMod = await import(pathToFileURL(path.join(tmpDir, 'rsvpService.mjs')).href);
const gvizMod = await import(pathToFileURL(path.join(tmpDir, 'gvizUtils.mjs')).href);

test.after(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

const SAMPLE_7COL_GVIZ = `/*O_o*/
google.visualization.Query.setResponse({
  "version":"0.6","reqId":"0","status":"ok",
  "table":{
    "cols":[
      {"id":"A","label":"Thời Gian Gửi","type":"string"},
      {"id":"B","label":"Họ Và Tên","type":"string"},
      {"id":"C","label":"Trạng Thái Tham Dự","type":"string"},
      {"id":"D","label":"Số Lượng Khách","type":"number"},
      {"id":"E","label":"Số Điện Thoại","type":"string"},
      {"id":"F","label":"Lời Chúc / Lời Nhắn","type":"string"},
      {"id":"G","label":"Nguồn Gửi","type":"string"}
    ],
    "rows":[
      {"c":[{"v":"11/11/2026 17:46:16"},{"v":"Chị Linh đáng êu"},{"v":"Chắc chắn tham dự"},{"v":1},{"v":"0936355283"},{"v":"Chị gặp trực tiếp"},{"v":"Thiệp cưới online"}]},
      {"c":[{"v":"12/11/2026 13:00:00"},{"v":"Anh Hoàng"},{"v":"Đã mở thiệp / Xác nhận xem thiệp"},{"v":1},null,{"v":"Khách đã nhấp vào link"},{"v":"Tự động ghi nhận"}]},
      {"c":[{"v":"12/11/2026 13:10:00"},{"v":"Bạn Minh"},{"v":"Sổ lưu bút chúc phúc"},{"v":0},null,{"v":"Chúc hai bạn trăm năm hạnh phúc!"},{"v":"Sổ Lưu Bút Chúc Phúc"}]},
      {"c":[{"v":"12/11/2026 13:15:00"},{"v":"<b>Cô Mai</b>"},{"v":"Sổ lưu bút chúc phúc"},{"v":0},null,{"v":"<script>alert(1)</script>Hạnh phúc viên mãn nhé!"},{"v":"Sổ Lưu Bút Chúc Phúc"}]},
      {"c":[{"v":"12/11/2026 13:20:00"},{"v":"Bạn"},{"v":"Sổ lưu bút chúc phúc"},{"v":0},null,{"v":"Chúc hai bạn trăm năm hạnh phúc!"},{"v":"Sổ Lưu Bút Chúc Phúc"}]},
      {"c":[{"v":"12/11/2026 13:25:00"},{"v":"Bạn"},{"v":"Sổ lưu bút chúc phúc"},{"v":0},null,{"v":"Chúc hai bạn trăm năm hạnh phúc!"},{"v":"Sổ Lưu Bút Chúc Phúc"}]}
    ]
  }
});`;

const SAMPLE_4COL_GVIZ_WITH_RSVP_KEYWORDS = `/*O_o*/
google.visualization.Query.setResponse({
  "version":"0.6","reqId":"0","status":"ok",
  "table":{
    "cols":[
      {"id":"A","label":"Thời Gian Gửi","type":"string"},
      {"id":"B","label":"Họ Và Tên","type":"string"},
      {"id":"C","label":"Lời Chúc Phúc","type":"string"},
      {"id":"D","label":"Nguồn Gửi","type":"string"}
    ],
    "rows":[
      {"c":[{"v":"Date(2026,10,12,14,5,9)"},{"v":"Bác Lan"},{"v":"Chúc hai cháu sớm tăng số lượng thành viên và giữ trạng thái hạnh phúc!"},{"v":"Sổ Lưu Bút Chúc Phúc"}]}
    ]
  }
});`;

test('parses wishes from 7-col sheet newest-first, sanitizes HTML, and keeps distinct timestamps', () => {
  const parsed = wishesMod.parseGvizResponseText(SAMPLE_7COL_GVIZ);
  assert.ok(parsed?.table);
  assert.equal(wishesMod.isRsvpTrackingTable(parsed.table), true);

  const wishes = wishesMod.parseWishesFromGvizTable(parsed.table);
  assert.equal(wishes.length, 5);
  assert.equal(wishes[0].name, 'Bạn');
  assert.equal(wishes[0].createdAt, '12/11/2026 13:25:00');
  assert.equal(wishes[1].createdAt, '12/11/2026 13:20:00');
  assert.equal(wishes[2].name, 'bCô Mai/b');
  assert.equal(wishes[2].message, 'scriptalert(1)/scriptHạnh phúc viên mãn nhé!');
  assert.equal(wishes[3].name, 'Bạn Minh');
  assert.equal(wishes[4].name, 'Chị Linh đáng êu');
  assert.equal(wishes[4].message, 'Chị gặp trực tiếp');
});

test('does not misclassify dedicated 4-col Sổ Lưu Bút sheet when wish mentions RSVP keywords', () => {
  const parsed = wishesMod.parseGvizResponseText(SAMPLE_4COL_GVIZ_WITH_RSVP_KEYWORDS);
  assert.ok(parsed?.table);
  assert.equal(wishesMod.isRsvpTrackingTable(parsed.table), false);

  const wishes = wishesMod.parseWishesFromGvizTable(parsed.table);
  assert.equal(wishes.length, 1);
  assert.equal(wishes[0].name, 'Bác Lan');
  assert.equal(wishes[0].createdAt, '14:05:09 12/11/2026');
});

test('RSVP parser excludes wish rows, ignores non-RSVP sheet fallback, and handles malformed JSON', () => {
  const rsvps = rsvpMod.parseRsvpGvizText(SAMPLE_7COL_GVIZ);
  assert.equal(rsvps.length, 1);
  assert.equal(rsvps[0].name, 'Chị Linh đáng êu');
  assert.equal(rsvps[0].status, 'yes');

  const wrongSheet = rsvpMod.parseRsvpGvizText(SAMPLE_4COL_GVIZ_WITH_RSVP_KEYWORDS);
  assert.equal(wrongSheet.length, 0);

  const malformed = rsvpMod.parseRsvpGvizText('not valid gviz');
  assert.deepEqual(malformed, []);

  assert.equal(gvizMod.formatGvizDateValue('Date(2026,10,12)'), '12/11/2026');
});

test('mergeLocalAndRemoteWishes keeps failed offline wishes past TTL, expires synced pending wishes, and drops legacy local-only entries', () => {
  const now = 1_700_000_000_000;
  const local = [
    { id: 'w-legacy', name: 'Old Local', message: 'Pre-fix', createdAt: 'Vừa xong' },
    { id: 'w-failed-offline', name: 'Offline Guest', message: 'Saved offline', createdAt: 'Vừa xong', createdAtMs: now - 60 * 60 * 1000, syncedToGoogleSheet: false },
    { id: 'w-deleted-remote', name: 'Deleted Guest', message: 'Removed in Sheet', createdAt: 'Vừa xong', createdAtMs: now - 10 * 60 * 1000, syncedToGoogleSheet: true },
    { id: 'w-fresh-pending', name: 'Fresh Guest', message: 'Just posted', createdAt: 'Vừa xong', createdAtMs: now - 30 * 1000, syncedToGoogleSheet: true },
    { id: 'w-already-synced', name: 'Bạn Minh', message: 'Chúc hai bạn trăm năm hạnh phúc!', createdAt: 'Vừa xong', createdAtMs: now - 10 * 1000, syncedToGoogleSheet: true },
  ];
  const remote = [
    { id: 'gs-1', name: 'Bạn Minh', message: 'Chúc hai bạn trăm năm hạnh phúc!', createdAt: '12/11/2026 13:10:00' },
  ];

  const mergedOnline = wishesMod.mergeLocalAndRemoteWishes(local, remote, true, now);
  assert.deepEqual(
    mergedOnline.map((w) => w.name),
    ['Offline Guest', 'Fresh Guest', 'Bạn Minh']
  );

  const offlineFallback = wishesMod.mergeLocalAndRemoteWishes(local, [], false, now);
  assert.equal(offlineFallback.length, 5);
});

test('fetchWishesFromGoogleSheet sorts cross-sheet wishes newest-first and handles 1-fetch 7-col fallback', async () => {
  const originalFetch = globalThis.fetch;
  try {
    let calls = [];
    globalThis.fetch = async (url) => {
      calls.push(String(url));
      return new Response(SAMPLE_7COL_GVIZ, { status: 200 });
    };
    const res1 = await wishesMod.fetchWishesFromGoogleSheet();
    assert.equal(res1.ok, true);
    assert.equal(calls.length, 1);
    assert.equal(res1.wishes.length, 5);

    calls = [];
    globalThis.fetch = async (url) => {
      const s = String(url);
      calls.push(s);
      if (s.includes(encodeURIComponent('Sổ Lưu Bút'))) {
        return new Response(SAMPLE_4COL_GVIZ_WITH_RSVP_KEYWORDS, { status: 200 });
      }
      return new Response(SAMPLE_7COL_GVIZ, { status: 200 });
    };
    const res2 = await wishesMod.fetchWishesFromGoogleSheet();
    assert.equal(res2.ok, true);
    assert.equal(calls.length, 2);
    assert.equal(res2.wishes.length, 6);
    assert.equal(res2.wishes[0].name, 'Bác Lan');
    assert.equal(res2.wishes[1].createdAt, '12/11/2026 13:25:00');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('submitWish rejects empty-after-sanitization, handles concurrent local updates, and survives SecurityError on localStorage', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  const originalLocalStorage = globalThis.localStorage;
  const store = new Map();

  globalThis.localStorage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  };
  globalThis.window = {
    dispatchEvent: () => true,
    localStorage: globalThis.localStorage,
  };

  try {
    let fetchCalled = false;
    globalThis.fetch = async () => {
      fetchCalled = true;
      return new Response('{}', { status: 200 });
    };
    const blankRes = await wishesMod.submitWish({ name: '  <> ', message: '   ' });
    assert.equal(blankRes.wish, null);
    assert.equal(blankRes.synced, false);
    assert.equal(fetchCalled, false);

    globalThis.fetch = async () => {
      // Simulate another tab/submission adding a wish while fetch is in flight
      const curr = JSON.parse(store.get('wedding_wishes') || '[]');
      store.set('wedding_wishes', JSON.stringify([
        { id: 'w-concurrent', name: 'Concurrent', message: 'Hi!', createdAt: 'Vừa xong', createdAtMs: Date.now() },
        ...curr,
      ]));
      return new Response('{}', { status: 200 });
    };
    const result = await wishesMod.submitWish({
      name: '  Chị Hương  ',
      message: '  Chúc mừng hạnh phúc!  ',
      justNowLabel: 'Vừa xong',
    });
    assert.equal(result.synced, true);
    const saved = wishesMod.getSavedWishes();
    assert.equal(saved.length, 2);
    assert.equal(saved.find((w) => w.name === 'Chị Hương')?.syncedToGoogleSheet, true);

    // Restricted localStorage throwing SecurityError
    globalThis.localStorage = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('SecurityError');
      },
    };
    globalThis.fetch = async () => new Response('{}', { status: 200 });
    const restrictedRes = await wishesMod.submitWish({ name: 'An', message: 'Chúc mừng!' });
    assert.equal(restrictedRes.synced, true);
    assert.equal(restrictedRes.wish?.name, 'An');
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
    globalThis.localStorage = originalLocalStorage;
  }
});

test('getAllUnifiedWishes does not overwrite a wish submitted while remote fetch is in flight', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  const originalLocalStorage = globalThis.localStorage;
  const store = new Map();

  globalThis.localStorage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  };
  globalThis.window = {
    dispatchEvent: () => true,
    localStorage: globalThis.localStorage,
  };
  globalThis.fetch = async () => {
    // Simulate a new wish written locally while fetchWishesFromGoogleSheet is awaiting response
    store.set('wedding_wishes', JSON.stringify([
      {
        id: 'w-inflight',
        name: 'Khách In-Flight',
        message: 'Mới gửi ngay lúc đang tải!',
        createdAt: 'Vừa xong',
        createdAtMs: Date.now(),
        syncedToGoogleSheet: true,
      },
    ]));
    return new Response(SAMPLE_7COL_GVIZ, { status: 200 });
  };

  try {
    const res = await wishesMod.getAllUnifiedWishes();
    assert.equal(res.remoteSynced, true);
    assert.equal(res.wishes[0].name, 'Khách In-Flight');
    assert.equal(res.wishes.length, 6);
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.window = originalWindow;
    globalThis.localStorage = originalLocalStorage;
  }
});
