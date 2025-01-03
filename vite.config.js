// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     rollupOptions: {
//       input: {
//         popup: 'index.html',
//       },
//       output: {
//         manualChunks: undefined,
//       },
//     },
//   }
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'public/manifest.json', dest: '' },
        { src: 'public/icon-48.png', dest: 'public' },
        { src: 'public/background.js', dest: 'public' }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
      },
      output: {
        manualChunks: undefined,
      },
    },
  }
});