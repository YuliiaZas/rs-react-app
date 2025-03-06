import { FC } from 'react';
import { ErrorComponent, Spinner } from '@lib';
import { PeopleFormatted, text } from '@utils';
import styles from './home-page-details.module.css';

export type HomePageDetailsProps = {
  data: PeopleFormatted | null;
  isLoading: boolean;
  isError: boolean;
  closeFn: () => void;
};

export const HomePageDetails: FC<HomePageDetailsProps> = ({
  data,
  isLoading = false,
  isError,
  closeFn,
}: HomePageDetailsProps) => {
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <button
        type="button"
        onClick={closeFn}
        aria-label="Close"
        className="button-icon"
      >
        <i className="icon-close" />
      </button>
      {(() => {
        if (isError) {
          return <ErrorComponent />;
        }
        if (!data) {
          return (
            <ErrorComponent errorMessageInfo={text.homePage.emptyDetails} />
          );
        }
        return (
          <div className={styles.card}>
            <h2>{data.name}</h2>
            <div className="card-detail">
              {data.details.map((detail) => {
                return (
                  <p className="small-card-detail" key={detail.key}>
                    <span className="small-card-detail-key">
                      {detail.key}:{' '}
                    </span>
                    <span className="small-card-detail-value">
                      {detail.value}
                    </span>
                  </p>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
