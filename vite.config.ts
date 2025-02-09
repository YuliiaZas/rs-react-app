import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, 'src/hooks'),
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['**/*.tsx', '**/*.ts'],
      exclude: [
        '**/node_modules/**',
        '**/*.test.tsx',
        '**/*.spec.tsx',
        'src/__tests__/setup.ts',
        '**/index.ts',
        '**/*.enum.ts',
        '**/*.type.ts',
        '**/*.interface.ts',
        '**/vite*.ts',
      ],
    },
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
    },
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },
});
