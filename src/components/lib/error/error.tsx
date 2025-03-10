import { FC } from 'react';
import { useNavigate } from 'react-router';
import { text } from '@utils';
import styles from './error.module.css';

interface ErrorComponentProps {
  errorMessage?: string;
  errorMessageInfo?: string;
  showButton?: boolean;
  buttonMessage?: string;
  buttonClick?: () => void;
}

export const ErrorComponent: FC<ErrorComponentProps> = ({
  errorMessage = text.errorComponent.errorMessage,
  errorMessageInfo,
  showButton = false,
  buttonMessage = text.errorComponent.button,
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
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
    </div>
  );
};
