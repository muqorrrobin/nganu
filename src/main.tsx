import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Mendaftarkan service worker PWA secara langsung untuk kemampuan offline
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(<App />);
