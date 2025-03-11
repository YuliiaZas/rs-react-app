import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, Mock, vi } from 'vitest';
import { useTheme } from '@context';
import { THEME } from '@utils';
import { ThemeSwitcher } from './theme-switcher';

vi.mock('./theme-switcher.module.css', () => ({
  default: {
    wrapper: 'theme-switcher-wrapper',
    label: 'theme-switcher-label',
    input: 'theme-switcher-input',
    icon: 'theme-switcher-icon',
    button: 'theme-switcher-button',
  },
}));

vi.mock('@context', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeSwitcher', () => {
  const useThemeSpy = useTheme as Mock;
  const setThemeValue = vi.fn();

  it('should render theme switcher with correct initial theme', () => {
    useThemeSpy.mockReturnValue([THEME.LIGHT, vi.fn()]);
    const { getByLabelText } = render(<ThemeSwitcher />);

    expect(getByLabelText(`${THEME.LIGHT} side`)).toBeChecked();
    expect(getByLabelText(`${THEME.DARK} side`)).not.toBeChecked();
  });

  it('should call setThemeValue when a theme is selected', () => {
    useThemeSpy.mockReturnValue([THEME.LIGHT, setThemeValue]);
    const { getByLabelText } = render(<ThemeSwitcher />);

    fireEvent.click(getByLabelText(`${THEME.DARK} side`));

    expect(setThemeValue).toHaveBeenCalledWith(THEME.DARK);
  });

  it('should update the theme when a different theme is selected', () => {
    useThemeSpy.mockReturnValue([THEME.DARK, setThemeValue]);
    const { getByLabelText } = render(<ThemeSwitcher />);

    fireEvent.click(getByLabelText(`${THEME.LIGHT} side`));

    expect(setThemeValue).toHaveBeenCalledWith(THEME.LIGHT);
  });
});
