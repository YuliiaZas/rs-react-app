import { PropsWithChildren, useEffect, useState } from 'react';
import { useLocalStorage } from '@hooks';
import { THEME } from '@utils';
import { ThemeContext } from './theme.context';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [userTheme, setUserTheme] = useLocalStorage({
    key: 'theme',
    defaultValue: THEME.DARK,
  });

  const [themeValue, setThemeValue] = useState(userTheme);

  useEffect(() => setUserTheme(themeValue), [setUserTheme, themeValue]);

  return (
    <ThemeContext.Provider value={[themeValue, setThemeValue]}>
      <div className={`theme-${themeValue}`}>{children}</div>
    </ThemeContext.Provider>
  );
};
