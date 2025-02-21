import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { ThemeProvider } from './theme.provider';
import { ThemeContext } from './theme.context';
import { THEME } from '@utils';

vi.mock('@hooks', () => ({
  useLocalStorage: vi.fn(),
}));

import { useLocalStorage } from '@hooks';

describe('ThemeProvider', () => {
  const useLocalStorageMock = useLocalStorage as Mock;

  beforeEach(() => {
    useLocalStorageMock.mockReturnValue([THEME.DARK, vi.fn()]);
  });

  it('should provide the default theme value', () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => <div data-testid="theme-value">{value[0]}</div>}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe(THEME.DARK);
  });

  it('should update theme value', () => {
    const setUserThemeMock = vi.fn();
    useLocalStorageMock.mockReturnValue([THEME.LIGHT, setUserThemeMock]);

    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => (
            <button onClick={() => value[1](THEME.DARK)}>Change Theme</button>
          )}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    act(() => {
      screen.getByText('Change Theme').click();
    });
    expect(setUserThemeMock).toHaveBeenCalledWith(THEME.DARK);
  });

  it('should apply the correct theme class to the div', () => {
    render(
      <ThemeProvider>
        <div data-testid="theme-div">Content</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-div').parentElement).toHaveClass(
      'theme-dark'
    );
  });
});
