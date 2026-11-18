import { useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { isStandalone, useOnline } from '../../lib/pwa';
import { href } from '../../lib/router';

const CHECK_EVERY_MS = 60 * 60 * 1000;
const MIN_GAP_MS = 10 * 60 * 1000;

/**
 * Registers the service worker that keeps the app working with no signal,
 * and shows a short message at the top of the page when:
 * - a new version has downloaded (tap Reload to switch to it),
 * - the app has just been saved for offline use, or
 * - there is no signal right now.
 */
export function PwaStatus() {
  const online = useOnline();
  const lastCheck = useRef(0);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      if (!reg) return;
      // Look for a new version now and then, and whenever the app comes back
      // to the front (phones keep home-screen apps open for days).
      const check = () => {
        if (!navigator.onLine || Date.now() - lastCheck.current < MIN_GAP_MS) return;
        lastCheck.current = Date.now();
        reg.update().catch(() => undefined);
      };
      window.setInterval(check, CHECK_EVERY_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
    },
  });

  const [updating, setUpdating] = useState(false);
  const reload = async () => {
    setUpdating(true);
    // The new version normally reloads the page itself once it takes over. A
    // page opened before the app was first saved (a phone tab left open for
    // days) isn't looked after by the old version, so nothing would reload it:
    // do it ourselves once the new version is running.
    const reg = await navigator.serviceWorker?.getRegistration().catch(() => undefined);
    const waiting = reg?.waiting;
    const go = () => window.location.reload();
    waiting?.addEventListener('statechange', () => {
      if (waiting.state === 'activated') go();
    });
    await updateServiceWorker(true);
    window.setTimeout(go, 4000);
  };

  if (needRefresh) {
    return (
      <div className="pwa-bar" role="status">
        <span>A new version of Hockey IQ is ready.</span>
        <span className="pwa-bar__actions">
          <button type="button" className="btn btn--primary btn--small" disabled={updating} onClick={() => void reload()}>
            {updating ? 'Reloading…' : 'Reload'}
          </button>
          <button type="button" className="btn btn--small" onClick={() => setNeedRefresh(false)}>
            Later
          </button>
        </span>
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div className="pwa-bar pwa-bar--ok" role="status">
        <span>
          Hockey IQ is saved on this device and now works with no signal.
          {isStandalone() ? null : (
            <>
              {' '}
              <a href={href('install')} onClick={() => setOfflineReady(false)}>
                Add it to your home screen
              </a>
            </>
          )}
        </span>
        <span className="pwa-bar__actions">
          <button type="button" className="btn btn--small" onClick={() => setOfflineReady(false)}>
            OK
          </button>
        </span>
      </div>
    );
  }

  if (!online) {
    return (
      <div className="pwa-bar pwa-bar--offline" role="status">
        No signal. Everything here still works, apart from links to other websites.
      </div>
    );
  }

  return null;
}
