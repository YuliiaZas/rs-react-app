import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { HomePage, HomePageDetails } from '@home-page';
import { ErrorComponent } from '@lib';
import './App.css';
import { PATH_VALUE } from '@utils';
import { peopleService } from '@services';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={PATH_VALUE.HOME} />,
  },
  {
    path: PATH_VALUE.HOME,
    element: <HomePage />,
    errorElement: <ErrorComponent showButton={true} />,
    children: [
      {
        path: `${PATH_VALUE.HOME}/:searchId`,
        element: <HomePageDetails />,
        loader: ({ params }) => peopleService.getItem(params.searchId),
        // hydrateFallbackElement: <Spinner />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <ErrorComponent
        errorMessage={'404'}
        errorMessageInfo={
          "We haven't created such a page yet. Let's try something else"
        }
        showButton={true}
      />
    ),
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
