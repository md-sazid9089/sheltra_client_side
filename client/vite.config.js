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
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: true,
      mangle: true,
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',   // required for Docker – listen on all interfaces
    open: false,        // cannot open browser inside a container
    // Proxy API requests to backend
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_ENDPOINT || 'http://sheltra_backend',
        changeOrigin: true,
        rewrite: (path) => path,  // Keep /api prefix
      },
    },
  },
});
