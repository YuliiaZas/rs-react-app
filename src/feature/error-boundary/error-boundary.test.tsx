import { fireEvent, render } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { text } from '@utils';
import { ErrorBoundary } from './error-boundary';

const mockErrorText = 'Mock Error Component';
const mockChildText = 'Mock Child Component';

vi.mock('@lib', () => ({
  ErrorComponent: vi.fn(({ showButton, buttonClick }) => (
    <div>
      {mockErrorText}
      {showButton && (
        <button onClick={buttonClick}>{text.errorComponent.button}</button>
      )}
    </div>
  )),
}));

describe('ErrorBoundary', () => {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.log = vi.fn(() => {});
    console.error = vi.fn(() => {});
  });

  afterAll(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it('should render children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>{mockChildText}</div>
      </ErrorBoundary>
    );

    expect(getByText(mockChildText)).toBeInTheDocument();
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

    expect(getByText(mockErrorText)).toBeInTheDocument();
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

    fireEvent.click(getByText(text.errorComponent.button));

    expect(console.log).toHaveBeenCalledWith(
      text.errorBoundary.redirectMessage
    );
  });
});
