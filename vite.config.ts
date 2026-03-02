import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-public-assets',
      closeBundle() {
        const publicDir = path.resolve(__dirname, 'public');
        const outDir = path.resolve(__dirname, 'dist');
        const entries = fs.readdirSync(publicDir);
        for (const entry of entries) {
          if (entry.includes(' ')) continue;
          const src = path.join(publicDir, entry);
          const dest = path.join(outDir, entry);
          if (fs.existsSync(src) && !fs.existsSync(dest)) {
            fs.copyFileSync(src, dest);
          }
        }
      },
    },
  ],
  publicDir: false,
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  preview: {
    port: 4173,
  },
  server: {
    historyApiFallback: true,
  },
});
