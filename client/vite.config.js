import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',   // required for Docker – listen on all interfaces
    open: false,        // cannot open browser inside a container
    // Proxy API requests to backend
    proxy: {
      '/api': {
        target: 'http://sheltra_backend',  // Docker service name for backend
        changeOrigin: true,
        rewrite: (path) => path,  // Keep /api prefix
      },
    },
  },
});
