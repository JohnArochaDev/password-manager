import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from 'vite-plugin-chrome-extension';
import manifest from './manifest.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
        background: 'src/background.js', // Include the background script to allow import decryptData from '../src/utils/decryption'

      },
      output: {
        manualChunks: undefined,
      },
    },
  }
});