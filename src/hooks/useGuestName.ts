import { useState, useEffect, useCallback } from 'react';

export function sanitizeGuestName(input: string): string {
  return input
    .replace(/[<>'"\\`]/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
    .slice(0, 60);
}

function getInitialGuestName(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const rawName = params.get('to') || params.get('guest') || params.get('name');

    if (!rawName) return null;

    const decoded = decodeURIComponent(rawName);
    const clean = sanitizeGuestName(decoded);
    return clean || null;
  } catch {
    return null;
  }
}

// Global subscribers for real-time reactivity across all components
const listeners = new Set<(name: string | null) => void>();
let currentGuestName: string | null = getInitialGuestName();

/**
 * Updates the guest name globally, updates browser URL query without page reload,
 * and notifies all components using useGuestName().
 */
export function setGlobalGuestName(name: string | null) {
  const sanitized = name ? sanitizeGuestName(name) : null;
  currentGuestName = sanitized;

  if (typeof window !== 'undefined') {
    try {
      const url = new URL(window.location.href);
      if (sanitized) {
        url.searchParams.set('to', sanitized);
        url.searchParams.delete('guest');
        url.searchParams.delete('name');
      } else {
        url.searchParams.delete('to');
        url.searchParams.delete('guest');
        url.searchParams.delete('name');
      }
      window.history.replaceState(null, '', url.toString());
    } catch {
      // Ignore if history state fails in restrictive contexts
    }
  }

  listeners.forEach((listener) => listener(currentGuestName));
}

/**
 * Generates the full shareable URL for a guest name.
 */
export function getGuestInvitationUrl(name?: string | null): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.origin + window.location.pathname);
  const target = name !== undefined ? name : currentGuestName;
  if (target && target.trim()) {
    url.searchParams.set('to', target.trim());
  }
  return url.toString();
}

/**
 * Reactive hook that returns the current guest name.
 */
export function useGuestName(): string | null {
  const [guestName, setGuestName] = useState<string | null>(currentGuestName);

  useEffect(() => {
    const handler = (newName: string | null) => {
      setGuestName(newName);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (guestName) {
        document.title = `Thiệp Mời: ${guestName} — Hoàng Nam & Ngọc Hiệp`;
      } else {
        document.title = 'Hoàng Nam & Ngọc Hiệp — Thiệp Cưới | Wedding Invitation';
      }
    }
  }, [guestName]);

  return guestName;
}

/**
 * Management hook for the Guest Settings modal.
 */
export function useGuestManager() {
  const guestName = useGuestName();
  const [isCopied, setIsCopied] = useState(false);

  const updateGuestName = useCallback((name: string | null) => {
    setGlobalGuestName(name);
  }, []);

  const copyInvitationLink = useCallback(async (customName?: string): Promise<boolean> => {
    const link = getGuestInvitationUrl(customName !== undefined ? customName : guestName);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        // Fallback for older browsers
        const input = document.createElement('textarea');
        input.value = link;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      return true;
    } catch {
      return false;
    }
  }, [guestName]);

  return {
    guestName,
    setGuestName: updateGuestName,
    copyInvitationLink,
    getInvitationUrl: getGuestInvitationUrl,
    isCopied,
  };
}
