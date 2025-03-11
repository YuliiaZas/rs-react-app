import { defineConfig } from 'vitest/config';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [!process.env.VITEST && reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@layout': path.resolve(__dirname, 'src/components/layout'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@lib': path.resolve(__dirname, 'src/components/lib'),
      '@mock': path.resolve(__dirname, 'src/mock'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@home-components': path.resolve(
        __dirname,
        'src/components/home-components'
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['**/*.tsx'],
      exclude: [
        '**/node_modules/**',
        '**/*.test.tsx',
        '**/*.spec.tsx',
        'src/__tests__/setup.ts',
      ],
    },
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
    },
    preprocessorOptions: {
      scss: {
        charset: false,
      },
    },
  },
});
