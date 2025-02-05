import { FC, useCallback, useMemo } from 'react';
import { CardSmall } from '@lib';
import { KeyValuePair, People } from '@utils';

interface HomePageItemsProps {
  title: string;
  items: People[];
}

function getListOfDetails(item: People): KeyValuePair[] {
  const { gender, birth_year: year, height, mass } = item;
  return [
    { key: 'Gender', value: gender },
    { key: 'Year of birth', value: year },
    { key: 'Height', value: height },
    { key: 'Mass', value: mass },
  ];
}

export const HomePageItems: FC<HomePageItemsProps> = ({ title, items }) => {
  const emptyResult =
    "Sorry, we couldn't find anything. Please check your request.";

  const itemsFormatted: { name: string; details: KeyValuePair[] }[] = useMemo(
    () =>
      items.map((item: People) => ({
        name: item.name,
        details: getListOfDetails(item),
      })),
    [items]
  );

  const getItemslist = useCallback<() => JSX.Element[]>(() => {
    return itemsFormatted.map(({ name, details }) => {
      return (
        <li key={name}>
          <CardSmall cardTitle={name} listOfDetails={details} />
        </li>
      );
    });
  }, [itemsFormatted]);

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {items.length ? <ul>{getItemslist()}</ul> : <p>{emptyResult}</p>}
      </div>
    </div>
  );
};
