import { FC } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { ErrorComponent, Spinner } from '@lib';
import { text } from '@utils';
import { useFetchItemQuery } from '../store/home-page-api.slice';
import './home-page-details.css';

export type HomePageDetailsProps = {
  closeFn: () => void;
};

export const HomePageDetails: FC = () => {
  const { closeFn } = useOutletContext<HomePageDetailsProps>();
  const { searchId } = useParams();

  const { data, isLoading, isError } = useFetchItemQuery(searchId as string, {
    skip: !searchId,
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <button type="button" onClick={closeFn}>
        x
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
          <div className="card">
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
