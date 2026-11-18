import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { isStandalone, keepStorage, listenForInstallPrompt } from './lib/pwa';
import './styles.css';

listenForInstallPrompt();
// Installed apps are usually allowed to keep their data; ask so saved plays aren't cleared.
if (isStandalone()) void keepStorage();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
