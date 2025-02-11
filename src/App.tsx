import {
  createBrowserRouter,
  LoaderFunctionArgs,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { HomePage, HomePageDetails } from '@home-page';
import { ErrorComponent, Spinner } from '@lib';
import { peopleService } from '@services';
import { PATH_VALUE } from '@utils';
import './App.css';

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
        loader: ({ params }: LoaderFunctionArgs) =>
          peopleService.getItem(params.searchId),
        element: <HomePageDetails />,
        hydrateFallbackElement: <Spinner />,
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
