import { isRouteErrorResponse, useNavigate } from 'react-router';
import { ErrorComponent } from '@lib';
import { text } from '@utils';
import { Route } from './+types/root';

export const ErrorBoundaryPage = ({ error }: Route.ErrorBoundaryProps) => {
  const navigate = useNavigate();

  const logError = (errorMessage: string, errorInfoStack: string) => {
    console.log(`
      \n ===========
      \n ErrorBoundary component catch the next error:
      \n ${errorMessage},
      \n with errorinfo:
      \n ${errorInfoStack}
      \n
      \n User can return to the previous view using the button "Home Page"
      \n ===========`);
  };

  const handleButtonClick = () => {
    redirectToHomePage();
  };

  const redirectToHomePage = () => {
    console.log(text.errorBoundary.redirectMessage);
    navigate('/');
  };

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorComponent
        errorMessage={error.statusText}
        errorMessageInfo={error.data}
        showButton={true}
        buttonClick={handleButtonClick}
      />
    );
  } else if (error instanceof Error) {
    logError(error.message, error.stack ?? '');
  }
  return <ErrorComponent showButton={true} buttonClick={handleButtonClick} />;
};
