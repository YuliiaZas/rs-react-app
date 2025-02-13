import { FC, Suspense } from 'react';
import { Await, useLoaderData, useOutletContext } from 'react-router-dom';
import { ErrorComponent, Spinner } from '@lib';
import { detailsLoader } from '@loaders';
import { getPeopleFormatted, text } from '@utils';
import './home-page-details.css';

export type HomePageDetailsProps = {
  closeFn: () => void;
};

export const HomePageDetails: FC = () => {
  const { closeFn } = useOutletContext<HomePageDetailsProps>();

  const { item } = useLoaderData<typeof detailsLoader>();

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <button type="button" onClick={() => closeFn()}>
          x
        </button>
        <Await resolve={item} errorElement={<ErrorComponent />}>
          {(loadedItem) => {
            const itemFormatted =
              !loadedItem || 'url' in loadedItem === false
                ? null
                : getPeopleFormatted(loadedItem, true);

            return !itemFormatted ? (
              <ErrorComponent errorMessageInfo={text.homePage.emptyDetails} />
            ) : (
              <div className="card">
                <h2>{itemFormatted.name}</h2>
                <div className="card-detail">
                  {itemFormatted.details.map((detail) => {
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
          }}
        </Await>
      </Suspense>
    </div>
  );
};
