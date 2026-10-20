/**
 * Cloudflare Worker with Enterprise-Grade Defensive Security Headers
 * Protects wedding invitation against Clickjacking, MIME sniffing, XSS, and unauthorized framing.
 */
export default {
  async fetch(request, env) {
    // 1. Block abnormal or unsafe HTTP methods
    if (!['GET', 'HEAD', 'OPTIONS', 'POST'].includes(request.method)) {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // 2. Fetch the requested asset from Cloudflare KV/Assets
    const response = await env.ASSETS.fetch(request);

    // 3. Clone response headers and attach defensive security policies
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

    // Disallow unnecessary browser capabilities (anti-malicious device access)
    headers.set(
      'Permissions-Policy',
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()'
    );

    // Cross-Site Scripting Protection for legacy agents
    headers.set('X-XSS-Protection', '1; mode=block');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
