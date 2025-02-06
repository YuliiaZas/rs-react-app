import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import { HomePage, HomePageDetails } from '@home-page';
import { ErrorComponent } from '@lib';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={'/search'} />,
  },
  {
    path: '/search',
    element: <HomePage />,
    errorElement: <ErrorComponent showButton={true} />,
    children: [
      {
        path: '/search/:searchId',
        element: <HomePageDetails />,
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
