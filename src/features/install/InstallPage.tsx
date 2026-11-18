import { useState } from 'react';
import {
  canWorkOffline,
  currentPlatform,
  isStandalone,
  useInstallPrompt,
  useOfflineReady,
  usePersisted,
  type Platform,
} from '../../lib/pwa';
import { href } from '../../lib/router';

function appAddress(): string {
  return window.location.origin + window.location.pathname.replace(/index\.html$/, '');
}

function Check({ ok, children }: { ok: boolean | null; children: React.ReactNode }) {
  return (
    <li className={`install__check install__check--${ok ? 'ok' : ok === false ? 'no' : 'maybe'}`}>
      <span className="install__icon" aria-hidden="true">
        {ok ? '✓' : ok === false ? '!' : '•'}
      </span>
      <span>{children}</span>
    </li>
  );
}

const STEPS: Record<Platform, { title: string; body: React.ReactNode }> = {
  ios: {
    title: 'iPhone or iPad',
    body: (
      <>
        <ol>
          <li>Open this page in Safari.</li>
          <li>
            Tap the <strong>Share</strong> button (a square with an arrow pointing up). On newer iPhones it’s in the{' '}
            <strong>•••</strong> menu at the bottom of the screen.
          </li>
          <li>
            Tap <strong>Add to Home Screen</strong>. You may need to scroll down or tap <strong>View More</strong> to
            find it.
          </li>
          <li>
            If you see <strong>Open as Web App</strong>, leave it on. Tap <strong>Add</strong>.
          </li>
        </ol>
        <p className="muted">
          Chrome on iPhone works too: tap Share in the address bar, then Add to Home Screen.
        </p>
      </>
    ),
  },
  android: {
    title: 'Android phone or tablet',
    body: (
      <>
        <ol>
          <li>Open this page in Chrome.</li>
          <li>
            Tap the <strong>⋮</strong> menu at the top right.
          </li>
          <li>
            Tap <strong>Add to home screen</strong>, then <strong>Install</strong>.
          </li>
        </ol>
        <p className="muted">
          Samsung Internet: tap the menu (☰), then <strong>Add page to</strong> → <strong>Home screen</strong>.
        </p>
      </>
    ),
  },
  desktop: {
    title: 'Laptop or desktop',
    body: (
      <ul>
        <li>
          <strong>Chrome or Edge:</strong> click the install icon at the right-hand end of the address bar, or open the
          browser menu and look for <strong>Install Hockey IQ</strong> (Chrome: Cast, save and share → Install page as
          app).
        </li>
        <li>
          <strong>Safari on a Mac:</strong> File → <strong>Add to Dock</strong>.
        </li>
        <li>Firefox can’t install web apps, but Hockey IQ still works there with no signal once it has loaded.</li>
      </ul>
    ),
  },
};

export function InstallPage() {
  const platform = currentPlatform();
  const standalone = isStandalone();
  const offline = canWorkOffline();
  const ready = useOfflineReady();
  const { persisted, ask } = usePersisted();
  const install = useInstallPrompt();
  const [copied, setCopied] = useState(false);
  const address = appAddress();
  const order: Platform[] = [platform, ...(['ios', 'android', 'desktop'] as const).filter((p) => p !== platform)];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="page install">
      <header className="page__header">
        <h1>Use it at the pitch</h1>
        <p className="lede">
          Add Hockey IQ to your phone’s home screen. It opens like an app, fills the screen and works with no signal,
          so you can check a play or a rule at the ground.
        </p>
      </header>

      <h2>On this device</h2>
      <ul className="install__checks">
        <Check ok={standalone || install.justInstalled ? true : null}>
          {standalone
            ? 'You’re using the installed app.'
            : install.justInstalled
              ? 'Installed. Open it from your home screen or app list.'
              : 'Not on the home screen yet: see below.'}
        </Check>
        <Check ok={offline ? ready : false}>
          {!offline
            ? 'This address can’t be saved for offline use (it needs a secure https link). Use the link below instead.'
            : ready
              ? 'Saved on this device: every page works with no signal.'
              : 'Saving for offline use… keep this page open for a few seconds while you have signal.'}
        </Check>
        <Check ok={persisted}>
          {persisted ? (
            'Your saved plays and quiz progress won’t be cleared to free up space.'
          ) : (
            <>
              The browser may clear saved plays and quiz progress if the device runs very short of space. Installing
              the app usually stops this, and you can keep a copy by exporting your plays from the{' '}
              <a href={href('board')}>tactics board</a>.
              {persisted === false && !standalone ? (
                <>
                  {' '}
                  <button type="button" className="btn btn--small" onClick={() => void ask()}>
                    Ask the browser to keep them
                  </button>
                </>
              ) : null}
            </>
          )}
        </Check>
      </ul>

      <h2>{standalone ? 'Put it on another device' : 'Add it to your home screen'}</h2>
      {install.canPrompt ? (
        <p>
          <button type="button" className="btn btn--primary" onClick={() => void install.prompt()}>
            Install Hockey IQ
          </button>
        </p>
      ) : null}
      <p className="install__address">
        <span className="muted">The address:</span> <strong>{address.replace(/^https?:\/\//, '')}</strong>{' '}
        {navigator.clipboard ? (
          <button type="button" className="btn btn--small" onClick={() => void copy()}>
            {copied ? 'Copied' : 'Copy link'}
          </button>
        ) : null}
      </p>
      {order.map((p) => (
        <details key={p} className="install__steps" open={p === platform}>
          <summary>{STEPS[p].title}</summary>
          {STEPS[p].body}
        </details>
      ))}

      <h2>Test it before match day</h2>
      <ol>
        <li>Open Hockey IQ once with signal, so it can save itself on the phone.</li>
        <li>Turn on aeroplane mode.</li>
        <li>Open Hockey IQ from your home screen and try a play, the quiz and the tactics board.</li>
        <li>Turn aeroplane mode off again.</li>
      </ol>

      <h2>Your saved plays and progress</h2>
      <p>
        Tactics board plays and quiz progress are kept on each device separately, and never sent anywhere. To move plays
        between your laptop and phone, use <strong>Export</strong> and <strong>Import</strong> on the{' '}
        <a href={href('board')}>tactics board</a>.
      </p>
      {platform === 'ios' ? (
        <aside className="note">
          <strong>On iPhone:</strong> the home-screen app keeps its own storage, separate from Safari. Plays you drew in
          Safari won’t appear in the app. Export them in Safari and import them in the app. Safari can also clear a
          site’s saved data after a week without a visit; the home-screen app doesn’t.
        </aside>
      ) : null}

      <h2>Updates</h2>
      <p>
        When there’s something new, the app downloads it in the background the next time you have signal and shows a{' '}
        <em>“new version is ready”</em> bar at the top. Tap <strong>Reload</strong> to switch to it.
      </p>
      <p className="muted">Version {__APP_VERSION__}</p>
    </article>
  );
}
