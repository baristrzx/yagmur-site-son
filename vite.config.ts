import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-and-copy-public-no-spaces',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ?? '/';
          const filePath = path.resolve(__dirname, 'public', url.replace(/^\//, ''));
          if (!url.includes(' ') && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: Record<string, string> = {
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml',
              '.ico': 'image/x-icon',
              '.webp': 'image/webp',
            };
            res.setHeader('Content-Type', mimeTypes[ext] ?? 'application/octet-stream');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
          next();
        });
      },
      closeBundle() {
        const publicDir = path.resolve(__dirname, 'public');
        const outDir = path.resolve(__dirname, 'dist');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const entries = fs.readdirSync(publicDir);
        for (const entry of entries) {
          if (entry.includes(' ')) continue;
          const src = path.join(publicDir, entry);
          const dest = path.join(outDir, entry);
          if (fs.statSync(src).isFile() && !fs.existsSync(dest)) {
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
