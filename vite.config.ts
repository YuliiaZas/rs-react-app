import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@home-page': path.resolve(__dirname, 'src/feature/home-page'),
      '@error-boundary': path.resolve(
        __dirname,
        'src/feature/error-boundary/error-boundary.tsx'
      ),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://swapi.dev/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
