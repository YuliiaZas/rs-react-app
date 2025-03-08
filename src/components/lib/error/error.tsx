'use client';

import { FC } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PATH_VALUE, text } from '@utils';
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
  const router = useRouter();
  const pathname = usePathname() ?? '';

  const handleClickDefault = () => {
    router.push('/');
    if (pathname === '' || pathname === PATH_VALUE.HOME) {
      window.location.reload();
    }
  };

  const handleClick = () => {
    if (buttonClick) {
      buttonClick();
    } else {
      handleClickDefault();
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
