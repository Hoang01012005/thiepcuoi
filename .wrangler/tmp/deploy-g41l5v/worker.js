var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.js
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
__name(escapeHtml, "escapeHtml");
var worker_default = {
  async fetch(request, env) {
    if (!["GET", "HEAD", "OPTIONS", "POST"].includes(request.method)) {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const url = new URL(request.url);
    const rawGuest = url.searchParams.get("to") || url.searchParams.get("guest") || url.searchParams.get("name") || url.searchParams.get("khach");
    let guestName = "";
    if (rawGuest) {
      try {
        guestName = decodeURIComponent(rawGuest).replace(/[<>'"\\`]/g, "").replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, 80);
      } catch {
        guestName = rawGuest.replace(/[<>'"\\`]/g, "").trim().slice(0, 80);
      }
    }
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://docs.google.com https://*.google.com https://*.googleusercontent.com https://img.vietqr.io; media-src 'self' blob: data:; connect-src 'self' https://docs.google.com https://script.google.com https://script.googleusercontent.com https://img.vietqr.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
    );
    headers.set("X-Frame-Options", "DENY");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    headers.set(
      "Permissions-Policy",
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
    );
    headers.set("X-XSS-Protection", "1; mode=block");
    const contentType = response.headers.get("content-type") || "";
    const isHtml = contentType.includes("text/html") || url.pathname === "/" || url.pathname.endsWith(".html");
    if (isHtml) {
      let html = await response.text();
      const pageTitle = guestName ? `Thi\u1EC7p M\u1EDDi: ${guestName} \u2014 \u0110o\xE0n Hi\u1EC7p & Nguy\u1EC5n Nam` : "\u0110o\xE0n Hi\u1EC7p & Nguy\u1EC5n Nam \u2014 Thi\u1EC7p C\u01B0\u1EDBi | Wedding Invitation";
      const pageDesc = guestName ? `Tr\xE2n tr\u1ECDng k\xEDnh m\u1EDDi ${guestName} t\u1EDBi tham d\u1EF1 l\u1EC5 c\u01B0\u1EDBi c\u1EE7a \u0110o\xE0n Hi\u1EC7p & Nguy\u1EC5n Nam v\xE0o ng\xE0y 28 & 29 th\xE1ng 11 n\u0103m 2026.` : "Tr\xE2n tr\u1ECDng k\xEDnh m\u1EDDi qu\xFD kh\xE1ch tham d\u1EF1 l\u1EC5 th\xE0nh h\xF4n c\u1EE7a \u0110o\xE0n Hi\u1EC7p & Nguy\u1EC5n Nam. Warmly invite you to celebrate the wedding of Doan Hiep & Nguyen Nam.";
      const ogImage = `${url.origin}/assets/photos/hero.jpg?v=20261021`;
      html = html.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(pageTitle)}</title>`);
      if (html.includes('property="og:title"')) {
        html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/is, `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`);
      } else {
        html = html.replace("</head>", `    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  </head>`);
      }
      if (html.includes('property="og:description"')) {
        html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/is, `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`);
      } else {
        html = html.replace("</head>", `    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
  </head>`);
      }
      if (html.includes('name="description"')) {
        html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/is, `<meta name="description" content="${escapeHtml(pageDesc)}" />`);
      }
      if (html.includes('property="og:image"')) {
        html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/is, `<meta property="og:image" content="${ogImage}" />`);
      } else {
        html = html.replace("</head>", `    <meta property="og:image" content="${ogImage}" />
  </head>`);
      }
      const extraTags = `    <meta property="og:url" content="${escapeHtml(url.href)}" />
    <meta property="og:site_name" content="Thi\u1EC7p C\u01B0\u1EDBi \u0110o\xE0n Hi\u1EC7p &amp; Nguy\u1EC5n Nam" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImage}" />`;
      html = html.replace("</head>", `${extraTags}
  </head>`);
      headers.set("Content-Type", "text/html; charset=utf-8");
      return new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
