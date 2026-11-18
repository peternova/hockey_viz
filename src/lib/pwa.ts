import { useEffect, useState } from 'react';

/** Which install instructions to show first. */
export type Platform = 'ios' | 'android' | 'desktop';

/**
 * Guess the platform from the user agent. iPads report themselves as a Mac,
 * so a "Mac" with a touch screen counts as iOS.
 */
export function platformOf(userAgent: string, maxTouchPoints = 0): Platform {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
  if (/Macintosh/i.test(userAgent) && maxTouchPoints > 1) return 'ios';
  if (/Android/i.test(userAgent)) return 'android';
  return 'desktop';
}

export function currentPlatform(): Platform {
  return platformOf(navigator.userAgent, navigator.maxTouchPoints ?? 0);
}

/** True when opened from the home screen (or as an installed app on a laptop). */
export function isStandalone(): boolean {
  try {
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
  } catch {
    // very old browsers
  }
  return (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

/** Service workers only run on https (or localhost). Over plain http on a LAN they're unavailable. */
export function canWorkOffline(): boolean {
  return window.isSecureContext && 'serviceWorker' in navigator;
}

// ---------------------------------------------------------------------------
// Chrome/Edge/Samsung "install" prompt. The event fires once, early, so it is
// caught here when the app starts and kept until the install page asks for it.

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferred: InstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((f) => f());

/** Call once at start-up (main.tsx). */
export function listenForInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // we show our own button on the install page instead
    deferred = e as InstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    installed = true;
    notify();
  });
}

/** `canPrompt` is true when the browser lets us show its install dialog from a button. */
export function useInstallPrompt(): { canPrompt: boolean; justInstalled: boolean; prompt: () => Promise<boolean> } {
  const [, force] = useState(0);
  useEffect(() => {
    const f = () => force((n) => n + 1);
    listeners.add(f);
    return () => {
      listeners.delete(f);
    };
  }, []);
  return {
    canPrompt: deferred !== null,
    justInstalled: installed,
    prompt: async () => {
      const e = deferred;
      if (!e) return false;
      deferred = null; // a prompt event can only be used once
      notify();
      await e.prompt();
      const { outcome } = await e.userChoice;
      return outcome === 'accepted';
    },
  };
}

// ---------------------------------------------------------------------------

export function useOnline(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

/**
 * Ask the browser not to clear our saved plays and progress when space runs
 * low. Browsers decide for themselves (installed apps are usually allowed) and
 * don't show a prompt for this in Chrome or Safari.
 */
export async function keepStorage(): Promise<boolean | null> {
  try {
    if (!navigator.storage?.persist) return null;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return null;
  }
}

/** `persisted` is null when the browser can't say (older browsers). */
export function usePersisted(): { persisted: boolean | null; ask: () => Promise<void> } {
  const [persisted, setPersisted] = useState<boolean | null>(null);
  useEffect(() => {
    let live = true;
    navigator.storage
      ?.persisted?.()
      .then((p) => live && setPersisted(p))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);
  return {
    persisted,
    ask: async () => {
      const p = await keepStorage();
      if (p !== null) setPersisted(p);
    },
  };
}

/**
 * Whether the app is saved for use with no signal: a service worker has
 * finished installing (it downloads every page and picture before it becomes
 * active), even if this particular page load isn't using it yet.
 */
export function useOfflineReady(): boolean {
  const [ready, setReady] = useState(() => canWorkOffline() && Boolean(navigator.serviceWorker.controller));
  useEffect(() => {
    if (!canWorkOffline()) return;
    let live = true;
    const sw = navigator.serviceWorker;
    const check = () => {
      if (sw.controller) setReady(true);
    };
    sw.addEventListener('controllerchange', check);
    sw.ready.then((reg) => live && reg.active && setReady(true)).catch(() => undefined);
    return () => {
      live = false;
      sw.removeEventListener('controllerchange', check);
    };
  }, []);
  return ready;
}
