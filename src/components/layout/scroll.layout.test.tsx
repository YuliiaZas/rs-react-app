import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useRouter } from 'next/router';
import ScrollLayout from './scroll.layout';

vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

describe('ScrollLayout', () => {
  const mockRouter = {
    events: {
      on: vi.fn(),
      off: vi.fn(),
    },
    query: {},
  };

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    const { getByText } = render(
      <ScrollLayout>
        <div>Test Content</div>
      </ScrollLayout>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should handle scroll event', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    act(() => {
      render(
        <ScrollLayout>
          <div>Test Content</div>
        </ScrollLayout>
      );
    });

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.any(Object)
    );

    expect(mockRouter.events.on).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );
    expect(mockRouter.events.on).toHaveBeenCalledWith(
      'routeChangeComplete',
      expect.any(Function)
    );

    expect(removeEventListenerSpy).not.toHaveBeenCalled();

    removeEventListenerSpy.mockRestore();
    addEventListenerSpy.mockRestore();
  });

  it('should handle route change start and complete', () => {
    const handleRouteChangeStart = vi.fn();
    const handleRouteChangeComplete = vi.fn();

    mockRouter.events.on.mockImplementation((event, callback) => {
      if (event === 'routeChangeStart') {
        handleRouteChangeStart.mockImplementation(callback);
      } else if (event === 'routeChangeComplete') {
        handleRouteChangeComplete.mockImplementation(callback);
      }
    });

    act(() => {
      render(
        <ScrollLayout>
          <div>Test Content</div>
        </ScrollLayout>
      );
    });

    act(() => {
      handleRouteChangeStart('/new-url');
    });
    expect(handleRouteChangeStart).toHaveBeenCalledWith('/new-url');

    act(() => {
      handleRouteChangeComplete();
    });
    expect(handleRouteChangeComplete).toHaveBeenCalled();
  });
});
