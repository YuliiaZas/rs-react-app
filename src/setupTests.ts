import '@testing-library/jest-dom';

const originalConsoleError = console.error;
const jsDomCssError = 'Error: Could not parse CSS stylesheet';
console.error = (...params) => {
  // eslint-disable-next-line prettier/prettier
  if (!params.find(p => p?.toString().includes(jsDomCssError))) {
    originalConsoleError(...params);
  }
};
