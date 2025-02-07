import { FC, useMemo } from 'react';
import { NavLink } from 'react-router';
import { CardSmall } from '@lib';
import { getPeopleFormatted, People, PeopleFormatted } from '@utils';

interface HomePageItemsProps {
  title: string;
  items: People[];
  locationSearch: string;
}

export const HomePageItems: FC<HomePageItemsProps> = ({
  title,
  items,
  locationSearch,
}) => {
  const emptyResult =
    "Sorry, we couldn't find anything. Please check your request.";

  const itemsFormatted: PeopleFormatted[] = useMemo(() => {
    return items.map((item: People) => getPeopleFormatted(item, false));
  }, [items]);

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {!items.length ? (
          <p>{emptyResult}</p>
        ) : (
          <ul>
            {itemsFormatted.map(({ id, name, details }) => (
              <li key={name}>
                <NavLink to={`${id}${locationSearch}`}>
                  <CardSmall cardTitle={name} listOfDetails={details} />
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
