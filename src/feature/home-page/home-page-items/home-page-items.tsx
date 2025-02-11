import { FC, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { CardSmall } from '@lib';
import { getPeopleFormatted, People, PeopleFormatted } from '@utils';
import './home-page-items.css';

interface HomePageItemsProps {
  title: string;
  items: People[];
  locationSearch: string;
}

const emptyResult =
  "Sorry, we couldn't find anything. Please check your request.";

export const HomePageItems: FC<HomePageItemsProps> = ({
  title,
  items,
  locationSearch,
}) => {
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
          <ul className="list">
            {itemsFormatted.map(({ id, name, details }) => (
              <li key={id}>
                <NavLink to={`${id}${locationSearch}`} className={'list-item'}>
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
