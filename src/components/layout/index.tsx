import { Provider } from 'react-redux';
import { FunctionComponent, ReactNode } from 'react';
import { HomeSearchParamsProvider, ThemeProvider } from '@context';
import { ThemeSwitcher } from '@lib';
import { store } from '@store';

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <HomeSearchParamsProvider>
        <ThemeProvider>
          <div className="app-wrapper">
            <header className="app-header">
              <ThemeSwitcher></ThemeSwitcher>
            </header>
            <div className="app-content">{children}</div>
            <footer className="app-footer">
              Icons by&nbsp;
              <a target="_blank" href="https://icons8.com" rel="noreferrer">
                Icons8
              </a>
            </footer>
          </div>
        </ThemeProvider>
      </HomeSearchParamsProvider>
    </Provider>
  );
};

export default Layout;
