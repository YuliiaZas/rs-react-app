import '@testing-library/jest-dom';
import { vi } from 'vitest';
import mockRouter from 'next-router-mock';

const originalConsoleError = console.error;
const jsDomCssError = 'Error: Could not parse CSS stylesheet';
console.error = (...params) => {
  if (!params.find((p) => p?.toString().includes(jsDomCssError))) {
    originalConsoleError(...params);
  }
};

vi.mock('*.module.css', () => ({}));

vi.mock('next/router', async (importOriginalModule) => {
  const actual = (await importOriginalModule()) as Record<string, unknown>;
  return {
    ...actual,
    useRouter: () => mockRouter,
  };
});
