import { FC } from 'react';
import { ErrorComponent, Spinner } from '@lib';
import { FetchResponce, PeopleFormatted, text } from '@utils';
import styles from './home-page-details.module.css';

export type HomePageDetailsProps = {
  itemData?: FetchResponce<PeopleFormatted | null>;
  isLoading: boolean;
  closeFn: () => void;
};

export const HomePageDetails: FC<HomePageDetailsProps> = ({
  itemData,
  isLoading = false,
  closeFn,
}: HomePageDetailsProps) => {
  if (isLoading) {
    return <Spinner />;
  }

  if (!itemData) {
    return <div></div>;
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
        if (itemData.error) {
          return <ErrorComponent />;
        }
        if (!itemData.data) {
          return (
            <ErrorComponent errorMessageInfo={text.homePage.emptyDetails} />
          );
        }
        return (
          <div className={styles.card}>
            <h2>{itemData.data.name}</h2>
            <div className="card-detail">
              {itemData.data.details.map((detail) => {
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
