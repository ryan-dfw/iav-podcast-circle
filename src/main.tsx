import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
// Self-hosted fonts (client's typography direction: Cormorant serif headlines, Inter sans body).
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-700.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/eb-garamond/latin-400.css';
import '@fontsource/eb-garamond/latin-400-italic.css';
import '@fontsource-variable/inter/wght.css';
import '@fontsource/caveat/latin-600.css';
import './styles/global.css';

async function start() {
  // Studio's draft preview: swaps the draft in before the first render. The
  // import is dynamic, so Firebase loads only when the parameter is present.
  const preview = new URLSearchParams(window.location.search).get('preview');
  if (preview) {
    try {
      const { applyPreview } = await import('./studio/preview');
      await applyPreview(preview);
    } catch (error) {
      console.error('preview failed', error);
    }
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void start();
