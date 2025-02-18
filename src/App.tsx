import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { HomeSearchProvider, ThemeProvider } from '@context';
import { HomePage, HomePageDetails } from '@home-page';
import { ErrorComponent, ThemeSwitcher } from '@lib';
import { store } from '@store';
import { PATH_VALUE, text } from '@utils';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={PATH_VALUE.HOME} />,
  },
  {
    path: PATH_VALUE.HOME,
    element: (
      <HomeSearchProvider>
        <HomePage />
      </HomeSearchProvider>
    ),
    errorElement: <ErrorComponent showButton={true} />,
    children: [
      {
        path: `${PATH_VALUE.HOME}/:searchId`,
        element: <HomePageDetails />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <ErrorComponent
        errorMessage={text.notFoundPage.errorMessage}
        errorMessageInfo={text.notFoundPage.errorMessageInfo}
        showButton={true}
      />
    ),
  },
]);

export const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="app-wrapper">
          <header>
            <ThemeSwitcher></ThemeSwitcher>
          </header>
          <RouterProvider router={router} />
        </div>
      </ThemeProvider>
    </Provider>
  );
};
