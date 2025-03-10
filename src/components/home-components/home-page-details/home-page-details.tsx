import { FC } from 'react';
import { useNavigate } from 'react-router';
import { ErrorComponent, Spinner } from '@lib';
import { FetchResponce, PATH_VALUE, PeopleFormatted, text } from '@utils';
import styles from './home-page-details.module.css';

export type HomePageDetailsProps = {
  itemData?: FetchResponce<PeopleFormatted | null>;
  searchParams?: string;
  isLoading?: boolean;
};

export const HomePageDetails: FC<HomePageDetailsProps> = ({
  itemData,
  searchParams,
  isLoading,
}: HomePageDetailsProps) => {
  const navigate = useNavigate();

  const closeFn = () => {
    navigate(`${PATH_VALUE.HOME}${searchParams}`);
  };

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
