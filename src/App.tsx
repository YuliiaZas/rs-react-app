import { ErrorBoundary } from '@error-boundary';
import { HomePage } from '@home-page';
import './App.css';

export const App = () => {
  return (
    <ErrorBoundary>
      <HomePage />
    </ErrorBoundary>
  );
};
