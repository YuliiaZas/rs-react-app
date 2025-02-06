import { FC } from 'react';
import { useNavigate } from 'react-router';
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
  buttonClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (buttonClick) {
      buttonClick();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="error-wrapper">
      <p className="error-message">{errorMessage}</p>
      {errorMessageInfo && (
        <p className="error-message-info">{errorMessageInfo}</p>
      )}
      {showButton && (
        <button className="error-button" onClick={handleClick}>
          {buttonMessage}
        </button>
      )}
    </div>
  );
};
