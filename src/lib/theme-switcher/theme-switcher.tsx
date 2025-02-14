import { FormEvent, FunctionComponent } from 'react';
import { useTheme } from '@hooks';
import { THEME } from '@utils';
import './theme-switche.css';

const themeIcon = {
  [THEME.DARK]: 'icon-darth-vader',
  [THEME.LIGHT]: 'icon-baby-yoda',
};

export const ThemeSwitcher: FunctionComponent = () => {
  const [themeValue, setThemeValue] = useTheme();

  const handleThemeValueChange = (e: FormEvent<HTMLInputElement>) => {
    setThemeValue((e.target as HTMLInputElement).value as THEME);
  };

  return (
    <div className="theme-switcher d-flex">
      <span className="theme-switcher-title">Choose:</span>
      {Object.values(THEME).map((value) => (
        <div key={value}>
          <input
            type="radio"
            name="theme"
            id={value}
            value={value}
            className="theme-switcher-input d-none"
            checked={themeValue === value}
            onChange={handleThemeValueChange}
          />
          <label
            htmlFor={value}
            className={`theme-switcher-label theme-color-${value}`}
          >
            <span className={`theme-switcher-icon ${themeIcon[value]}`}></span>
            <span className="theme-switcher-value">{value} side</span>
          </label>
        </div>
      ))}
    </div>
  );
};
