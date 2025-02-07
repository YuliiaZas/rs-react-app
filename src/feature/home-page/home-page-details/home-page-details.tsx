import { FC, useMemo } from 'react';
import { useLoaderData, useOutletContext } from 'react-router';
import { getPeopleFormatted, People, PeopleFormatted } from '@utils';

export type HomePageDetailsProps = {
  closeFn: () => void;
};

export const HomePageDetails: FC = () => {
  const { closeFn } = useOutletContext<HomePageDetailsProps>();

  const item = useLoaderData<People>();

  const itemFormatted: PeopleFormatted = useMemo(
    () => getPeopleFormatted(item, true),
    [item]
  );

  return (
    <div>
      <button type="button" onClick={() => closeFn()}>
        x
      </button>
      <h3>{itemFormatted.name}</h3>
      <p className="small-card-detail">details.</p>
    </div>
  );
};
