import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const appServerUrl = env.APP_SERVER_URL || 'http://localhost:7272';
  const url = new URL(appServerUrl);

  return {
    plugins: [react(), tailwindcss()],
    base: './',
    build: {
      outDir: 'dist-react',
    },
    server: {
      host: url.hostname,
      port: parseInt(url.port) || 7272,
      strictPort: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
