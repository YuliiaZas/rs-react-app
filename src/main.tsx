import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ErrorContextProvider } from './utils/error-context.tsx';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ErrorContextProvider>
        <App />
      </ErrorContextProvider>
    </StrictMode>
  );
}
