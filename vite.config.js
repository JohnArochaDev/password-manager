import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html', // Popup HTML entry file
      },
      output: {
        manualChunks: undefined,  // Avoid splitting chunks
      },
    },
  },
  define: {
    'chrome': 'chrome', // Declare chrome as a global variable (for development only)
  },
});
