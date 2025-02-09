import { FC, useMemo } from 'react';
import { useLoaderData, useOutletContext } from 'react-router-dom';
import { ErrorComponent } from '@lib';
import {
  getPeopleFormatted,
  People,
  PeopleFormatted,
  PeopleUnknown,
} from '@utils';
import './home-page-details.css';

export type HomePageDetailsProps = {
  closeFn: () => void;
};

const errorMessage = "It seems we don't know this person";

export const HomePageDetails: FC = () => {
  const { closeFn } = useOutletContext<HomePageDetailsProps>();

  const item = useLoaderData<People | PeopleUnknown>();

  const itemFormatted: PeopleFormatted | null = useMemo(() => {
    return 'url' in item === false ? null : getPeopleFormatted(item, true);
  }, [item]);

  return (
    <div>
      <button type="button" onClick={() => closeFn()}>
        x
      </button>
      {!itemFormatted ? (
        <ErrorComponent errorMessageInfo={errorMessage} />
      ) : (
        <div className="card">
          <h2>{itemFormatted.name}</h2>
          <div className="card-detail">
            {itemFormatted.details.map((item) => {
              return (
                <p className="small-card-detail" key={item.key}>
                  <span className="small-card-detail-key">{item.key}: </span>
                  <span className="small-card-detail-value">{item.value}</span>
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
