'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { useLocalStorage, useRunOnce } from '@hooks';
import { THEME } from '@utils';
import { ThemeContext } from './theme.context';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [userTheme, setUserTheme] = useLocalStorage({
    key: 'theme',
    defaultValue: THEME.DARK,
  });

  const [themeValue, setThemeValue] = useState(THEME.DARK);

  useRunOnce(
    {
      fn: () => setThemeValue(userTheme),
    },
    [userTheme]
  );

  useEffect(() => setUserTheme(themeValue), [setUserTheme, themeValue]);

  return (
    <ThemeContext.Provider value={[themeValue, setThemeValue]}>
      <div className={`theme-${themeValue}`} style={{ width: '100%' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
