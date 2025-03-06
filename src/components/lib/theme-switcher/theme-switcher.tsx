import { FormEvent, FunctionComponent } from 'react';
import { useTheme } from '@context';
import { THEME } from '@utils';
import style from './theme-switcher.module.css';

const themeIcon = {
  [THEME.DARK]: 'icon-darth-vader',
  [THEME.LIGHT]: 'icon-baby-yoda',
};

export const ThemeSwitcher: FunctionComponent = () => {
  const [themeValue, setThemeValue] = useTheme();

  const handleThemeValueChange = (e: FormEvent<HTMLInputElement>) => {
    setThemeValue(e.currentTarget.value as THEME);
  };

  return (
    <div className={`${style['theme-switcher']} d-flex`}>
      <span className={style['theme-switcher-title']}>Choose:</span>
      {Object.values(THEME).map((value) => (
        <div key={value}>
          <input
            type="radio"
            name="theme"
            id={value}
            value={value}
            className={`${style['theme-switcher-input']} d-none`}
            checked={themeValue === value}
            onChange={handleThemeValueChange}
          />
          <label
            htmlFor={value}
            className={`${style['theme-switcher-label']} theme-color-${value}`}
          >
            <span
              className={`${style['theme-switcher-icon']} ${themeIcon[value]}`}
            ></span>
            <span className={style['theme-switcher-value']}>{value} side</span>
          </label>
        </div>
      ))}
    </div>
  );
};
