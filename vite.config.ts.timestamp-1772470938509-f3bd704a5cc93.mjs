// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      name: "serve-and-copy-public-no-spaces",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ?? "/";
          const filePath = path.resolve(__vite_injected_original_dirname, "public", url.replace(/^\//, ""));
          if (!url.includes(" ") && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
              ".png": "image/png",
              ".jpg": "image/jpeg",
              ".jpeg": "image/jpeg",
              ".gif": "image/gif",
              ".svg": "image/svg+xml",
              ".ico": "image/x-icon",
              ".webp": "image/webp"
            };
            res.setHeader("Content-Type", mimeTypes[ext] ?? "application/octet-stream");
            fs.createReadStream(filePath).pipe(res);
            return;
          }
          next();
        });
      },
      closeBundle() {
        const publicDir = path.resolve(__vite_injected_original_dirname, "public");
        const outDir = path.resolve(__vite_injected_original_dirname, "dist");
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        const entries = fs.readdirSync(publicDir);
        for (const entry of entries) {
          if (entry.includes(" ")) continue;
          const src = path.join(publicDir, entry);
          const dest = path.join(outDir, entry);
          if (fs.statSync(src).isFile() && !fs.existsSync(dest)) {
            fs.copyFileSync(src, dest);
          }
        }
      }
    }
  ],
  publicDir: false,
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  preview: {
    port: 4173
  },
  server: {
    historyApiFallback: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB7XG4gICAgICBuYW1lOiAnc2VydmUtYW5kLWNvcHktcHVibGljLW5vLXNwYWNlcycsXG4gICAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgICAgY29uc3QgdXJsID0gcmVxLnVybCA/PyAnLyc7XG4gICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncHVibGljJywgdXJsLnJlcGxhY2UoL15cXC8vLCAnJykpO1xuICAgICAgICAgIGlmICghdXJsLmluY2x1ZGVzKCcgJykgJiYgZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkgJiYgZnMuc3RhdFN5bmMoZmlsZVBhdGgpLmlzRmlsZSgpKSB7XG4gICAgICAgICAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoZmlsZVBhdGgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBjb25zdCBtaW1lVHlwZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgICAgICAgICcucG5nJzogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICAgICcuanBnJzogJ2ltYWdlL2pwZWcnLFxuICAgICAgICAgICAgICAnLmpwZWcnOiAnaW1hZ2UvanBlZycsXG4gICAgICAgICAgICAgICcuZ2lmJzogJ2ltYWdlL2dpZicsXG4gICAgICAgICAgICAgICcuc3ZnJzogJ2ltYWdlL3N2Zyt4bWwnLFxuICAgICAgICAgICAgICAnLmljbyc6ICdpbWFnZS94LWljb24nLFxuICAgICAgICAgICAgICAnLndlYnAnOiAnaW1hZ2Uvd2VicCcsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgbWltZVR5cGVzW2V4dF0gPz8gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScpO1xuICAgICAgICAgICAgZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlUGF0aCkucGlwZShyZXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGNsb3NlQnVuZGxlKCkge1xuICAgICAgICBjb25zdCBwdWJsaWNEaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncHVibGljJyk7XG4gICAgICAgIGNvbnN0IG91dERpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdkaXN0Jyk7XG4gICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhvdXREaXIpKSBmcy5ta2RpclN5bmMob3V0RGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgY29uc3QgZW50cmllcyA9IGZzLnJlYWRkaXJTeW5jKHB1YmxpY0Rpcik7XG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgZW50cmllcykge1xuICAgICAgICAgIGlmIChlbnRyeS5pbmNsdWRlcygnICcpKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCBzcmMgPSBwYXRoLmpvaW4ocHVibGljRGlyLCBlbnRyeSk7XG4gICAgICAgICAgY29uc3QgZGVzdCA9IHBhdGguam9pbihvdXREaXIsIGVudHJ5KTtcbiAgICAgICAgICBpZiAoZnMuc3RhdFN5bmMoc3JjKS5pc0ZpbGUoKSAmJiAhZnMuZXhpc3RzU3luYyhkZXN0KSkge1xuICAgICAgICAgICAgZnMuY29weUZpbGVTeW5jKHNyYywgZGVzdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gIF0sXG4gIHB1YmxpY0RpcjogZmFsc2UsXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIHByZXZpZXc6IHtcbiAgICBwb3J0OiA0MTczLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBoaXN0b3J5QXBpRmFsbGJhY2s6IHRydWUsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUhqQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTjtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sZ0JBQWdCLFFBQVE7QUFDdEIsZUFBTyxZQUFZLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztBQUN6QyxnQkFBTSxNQUFNLElBQUksT0FBTztBQUN2QixnQkFBTSxXQUFXLEtBQUssUUFBUSxrQ0FBVyxVQUFVLElBQUksUUFBUSxPQUFPLEVBQUUsQ0FBQztBQUN6RSxjQUFJLENBQUMsSUFBSSxTQUFTLEdBQUcsS0FBSyxHQUFHLFdBQVcsUUFBUSxLQUFLLEdBQUcsU0FBUyxRQUFRLEVBQUUsT0FBTyxHQUFHO0FBQ25GLGtCQUFNLE1BQU0sS0FBSyxRQUFRLFFBQVEsRUFBRSxZQUFZO0FBQy9DLGtCQUFNLFlBQW9DO0FBQUEsY0FDeEMsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLFlBQ1g7QUFDQSxnQkFBSSxVQUFVLGdCQUFnQixVQUFVLEdBQUcsS0FBSywwQkFBMEI7QUFDMUUsZUFBRyxpQkFBaUIsUUFBUSxFQUFFLEtBQUssR0FBRztBQUN0QztBQUFBLFVBQ0Y7QUFDQSxlQUFLO0FBQUEsUUFDUCxDQUFDO0FBQUEsTUFDSDtBQUFBLE1BQ0EsY0FBYztBQUNaLGNBQU0sWUFBWSxLQUFLLFFBQVEsa0NBQVcsUUFBUTtBQUNsRCxjQUFNLFNBQVMsS0FBSyxRQUFRLGtDQUFXLE1BQU07QUFDN0MsWUFBSSxDQUFDLEdBQUcsV0FBVyxNQUFNLEVBQUcsSUFBRyxVQUFVLFFBQVEsRUFBRSxXQUFXLEtBQUssQ0FBQztBQUNwRSxjQUFNLFVBQVUsR0FBRyxZQUFZLFNBQVM7QUFDeEMsbUJBQVcsU0FBUyxTQUFTO0FBQzNCLGNBQUksTUFBTSxTQUFTLEdBQUcsRUFBRztBQUN6QixnQkFBTSxNQUFNLEtBQUssS0FBSyxXQUFXLEtBQUs7QUFDdEMsZ0JBQU0sT0FBTyxLQUFLLEtBQUssUUFBUSxLQUFLO0FBQ3BDLGNBQUksR0FBRyxTQUFTLEdBQUcsRUFBRSxPQUFPLEtBQUssQ0FBQyxHQUFHLFdBQVcsSUFBSSxHQUFHO0FBQ3JELGVBQUcsYUFBYSxLQUFLLElBQUk7QUFBQSxVQUMzQjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFdBQVc7QUFBQSxFQUNYLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixvQkFBb0I7QUFBQSxFQUN0QjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
