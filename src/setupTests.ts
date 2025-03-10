import '@testing-library/jest-dom';
import { vi } from 'vitest';

const originalConsoleError = console.error;
const jsDomCssError = 'Error: Could not parse CSS stylesheet';
console.error = (...params) => {
  if (!params.find((p) => p?.toString().includes(jsDomCssError))) {
    originalConsoleError(...params);
  }
};

vi.mock('*.module.css', () => ({}));

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});
