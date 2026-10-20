/**
 * Cloudflare Worker for Wedding Invitation:
 * 1. Dynamic Open Graph & Social Preview metadata (Zalo, Messenger, Telegram, Facebook)
 *    When a personalized link is pasted (e.g. ?to=Gia đình nhà bác Soái), it dynamically
 *    renders "Thiệp Mời: [Tên khách] — Hoàng Nam & Ngọc Hiệp" in the social snippet card.
 * 2. Enterprise-Grade Defensive Security Headers (CSP, HSTS, X-Frame-Options, Permissions-Policy).
 */

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default {
  async fetch(request, env) {
    // 1. Block abnormal or unsafe HTTP methods
    if (!['GET', 'HEAD', 'OPTIONS', 'POST'].includes(request.method)) {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);

    // 2. Extract and sanitize personalized guest parameter (?to=, ?guest=, ?name=, ?khach=)
    const rawGuest =
      url.searchParams.get('to') ||
      url.searchParams.get('guest') ||
      url.searchParams.get('name') ||
      url.searchParams.get('khach');

    let guestName = '';
    if (rawGuest) {
      try {
        guestName = decodeURIComponent(rawGuest)
          .replace(/[<>'"\\`]/g, '')
          .replace(/[\x00-\x1F\x7F]/g, '')
          .trim()
          .slice(0, 80);
      } catch {
        guestName = rawGuest.replace(/[<>'"\\`]/g, '').trim().slice(0, 80);
      }
    }

    // 3. Fetch the requested asset from Cloudflare KV/Assets
    const response = await env.ASSETS.fetch(request);

    // 4. Clone response headers and attach defensive security policies
    const headers = new Headers(response.headers);

    // Content Security Policy (CSP)
    headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com data:; " +
      "img-src 'self' data: blob: https://docs.google.com https://*.google.com https://*.googleusercontent.com https://img.vietqr.io; " +
      "media-src 'self' blob: data:; " +
      "connect-src 'self' https://docs.google.com https://script.google.com https://script.googleusercontent.com https://img.vietqr.io; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
    );

    // Anti-Clickjacking
    headers.set('X-Frame-Options', 'DENY');

    // Anti-MIME Sniffing
    headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer Policy
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Enforce HTTPS
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // Disallow unnecessary browser capabilities
    headers.set(
      'Permissions-Policy',
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
    );

    // Cross-Site Scripting Protection for legacy agents
    headers.set('X-XSS-Protection', '1; mode=block');

    // 5. If this is an HTML document response, dynamically inject personalized Open Graph tags
    const contentType = response.headers.get('content-type') || '';
    const isHtml = contentType.includes('text/html') || url.pathname === '/' || url.pathname.endsWith('.html');

    if (isHtml) {
      let html = await response.text();

      // Dynamic title and description for Zalo, Messenger, Telegram, Facebook link previews
      const pageTitle = guestName
        ? `Thiệp Mời: ${guestName} — Hoàng Nam & Ngọc Hiệp`
        : 'Hoàng Nam & Ngọc Hiệp — Thiệp Cưới | Wedding Invitation';

      const pageDesc = guestName
        ? `Trân trọng kính mời ${guestName} tới tham dự lễ cưới của Hoàng Nam & Ngọc Hiệp vào ngày 28 & 29 tháng 11 năm 2026.`
        : 'Trân trọng kính mời quý khách tham dự lễ thành hôn của Hoàng Nam & Ngọc Hiệp. Warmly invite you to celebrate the wedding of Hoang Nam & Ngoc Hiep.';

      const ogImage = `${url.origin}/assets/photos/hero.jpg`;

      // Replace HTML <title>
      html = html.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(pageTitle)}</title>`);

      // Replace or inject og:title
      if (html.includes('property="og:title"')) {
        html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/is, `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`);
      } else {
        html = html.replace('</head>', `    <meta property="og:title" content="${escapeHtml(pageTitle)}" />\n  </head>`);
      }

      // Replace or inject og:description
      if (html.includes('property="og:description"')) {
        html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/is, `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`);
      } else {
        html = html.replace('</head>', `    <meta property="og:description" content="${escapeHtml(pageDesc)}" />\n  </head>`);
      }

      // Replace meta name="description"
      if (html.includes('name="description"')) {
        html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/is, `<meta name="description" content="${escapeHtml(pageDesc)}" />`);
      }

      // Ensure og:image is absolute URL for Zalo / Facebook / Telegram crawlers
      if (html.includes('property="og:image"')) {
        html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/is, `<meta property="og:image" content="${ogImage}" />`);
      } else {
        html = html.replace('</head>', `    <meta property="og:image" content="${ogImage}" />\n  </head>`);
      }

      // Ensure og:url, og:site_name, and twitter cards are present
      const extraTags = `    <meta property="og:url" content="${escapeHtml(url.href)}" />
    <meta property="og:site_name" content="Thiệp Cưới Hoàng Nam &amp; Ngọc Hiệp" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImage}" />`;

      html = html.replace('</head>', `${extraTags}\n  </head>`);

      headers.set('Content-Type', 'text/html; charset=utf-8');

      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
