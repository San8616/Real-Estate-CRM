import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { spawn } from 'node:child_process'
import http from 'node:http'

function apiServerStarter() {
  let serverProcess = null;

  return {
    name: 'api-server-starter',
    async configureServer(server) {
      const isAlreadyRunning = await new Promise((resolve) => {
        const req = http.get('http://127.0.0.1:5000/api/health', (res) => {
          resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(800, () => {
          req.destroy();
          resolve(false);
        });
      });

      if (isAlreadyRunning) {
        return;
      }

      console.log('🚀 Starting Express backend API server on port 5000...');
      serverProcess = spawn('node', ['server/index.js'], {
        stdio: 'inherit',
        shell: true,
      });

      serverProcess.on('error', (err) => {
        console.error('Failed to start backend server:', err.message);
      });

      const cleanup = () => {
        if (serverProcess && !serverProcess.killed) {
          try {
            serverProcess.kill();
          } catch {
            // ignore
          }
        }
      };

      process.on('exit', cleanup);
      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
      server.httpServer?.on('close', cleanup);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiServerStarter(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
