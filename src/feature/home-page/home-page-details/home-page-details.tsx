import { FC, useEffect, useMemo, useState } from 'react';
import {
  useLoaderData,
  useNavigation,
  useOutletContext,
} from 'react-router-dom';
import { ErrorComponent, Spinner } from '@lib';
import {
  getPeopleFormatted,
  People,
  PeopleFormatted,
  PeopleUnknown,
  text,
} from '@utils';
import './home-page-details.css';

export type HomePageDetailsProps = {
  closeFn: () => void;
};

export const HomePageDetails: FC = () => {
  const { closeFn } = useOutletContext<HomePageDetailsProps>();

  const item = useLoaderData<People | PeopleUnknown>();

  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    setIsLoading(navigation.state === 'loading');
  }, [navigation]);

  const itemFormatted: PeopleFormatted | null = useMemo(() => {
    return !item || 'url' in item === false
      ? null
      : getPeopleFormatted(item, true);
  }, [item]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <button type="button" onClick={() => closeFn()}>
        x
      </button>
      {!itemFormatted ? (
        <ErrorComponent errorMessageInfo={text.homePage.emptyDetails} />
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
