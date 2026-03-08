import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.BACKEND_URL;
  const backendPort = env.BACKEND_PORT || '5000';
  const proxyTarget = backendUrl || `http://localhost:${backendPort}`;

  return {
    plugins: [react()],
    server: {
      port: env.VITE_PORT || 5173,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true
        }
      }
    },
    preview: {
      port: 3000
    }
  };
});
