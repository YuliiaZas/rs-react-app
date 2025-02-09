import { fireEvent, render } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './error-boundary';

vi.mock('@lib', () => ({
  ErrorComponent: vi.fn(({ showButton, buttonClick }) => (
    <div>
      ErrorComponent
      {showButton && <button onClick={buttonClick}>Home Page</button>}
    </div>
  )),
}));

describe('ErrorBoundary', () => {
  const originalConsoleLog = console.log;

  beforeAll(() => {
    console.log = vi.fn();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  it('should render children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Child Component</div>
      </ErrorBoundary>
    );
    expect(getByText('Child Component')).toBeInTheDocument();
  });

  it('should render ErrorComponent when there is an error', () => {
    const ThrowError = () => {
      throw new Error('Test Error');
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText('ErrorComponent')).toBeInTheDocument();
  });

  it('should redirect to home page on button click', () => {
    const ThrowError = () => {
      throw new Error('Test Error');
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(getByText('Home Page'));

    expect(console.log).toHaveBeenCalledWith('Redirect to Home Page');
  });
});
