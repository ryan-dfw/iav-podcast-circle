import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Keep in sync with src/config/integrations.ts and netlify.toml.
// UULF… is YouTube's auto-playlist of a channel's uploads excluding Shorts (UC… -> UULF…).
const YOUTUBE_UPLOADS_PLAYLIST_ID = 'UULFxfm6b5Y5mdn5vTh3fbRqcQ';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Same-origin path so the browser isn't blocked by YouTube's missing CORS headers.
      '/api/youtube-feed': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        rewrite: () => `/feeds/videos.xml?playlist_id=${YOUTUBE_UPLOADS_PLAYLIST_ID}`,
      },
    },
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
