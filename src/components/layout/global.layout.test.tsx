import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import GlobalLayout from './global.layout';

vi.mock('@context', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  HomeSearchParamsProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@store', () => ({
  store: {
    getState: vi.fn(),
    subscribe: vi.fn(),
    dispatch: vi.fn(),
  },
}));

vi.mock('@lib', () => ({
  ThemeSwitcher: () => <div>ThemeSwitcher</div>,
}));

describe('GlobalLayout', () => {
  it('should render children', () => {
    const { getByText } = render(
      <GlobalLayout>
        <div>Test Content</div>
      </GlobalLayout>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should render ThemeSwitcher', () => {
    const { getByText } = render(
      <GlobalLayout>
        <div>Test Content</div>
      </GlobalLayout>
    );
    expect(getByText('ThemeSwitcher')).toBeInTheDocument();
  });

  it('should render footer with Icons8 link', () => {
    const { getByText } = render(
      <GlobalLayout>
        <div>Test Content</div>
      </GlobalLayout>
    );
    expect(getByText('Icons by')).toBeInTheDocument();
    expect(getByText('Icons8')).toBeInTheDocument();
  });
});
