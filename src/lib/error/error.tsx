import { FC } from 'react';
import './error.css';

interface ErrorComponentProps {
  errorMessage?: string;
  errorMessageInfo?: string;
  showButton?: boolean;
  buttonMessage?: string;
  buttonClick?: () => void;
}

export const ErrorComponent: FC<ErrorComponentProps> = ({
  errorMessage = 'Ooops! Something went wrong...',
  errorMessageInfo,
  showButton = false,
  buttonMessage = 'Home Page',
  buttonClick = () => {},
}) => {
  return (
    <div className="error-wrapper">
      <p className="error-message">{errorMessage}</p>
      {errorMessageInfo && (
        <p className="error-message-info">{errorMessageInfo}</p>
      )}
      {showButton && (
        <button className="error-button" onClick={buttonClick}>
          {buttonMessage}
        </button>
      )}
    </div>
  );
};
