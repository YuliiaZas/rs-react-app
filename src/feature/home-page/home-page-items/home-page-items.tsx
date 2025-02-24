import { FC, FormEvent, MouseEvent, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useHomeSearch } from '@context';
import { useAppDispatch, useAppSelector } from '@hooks';
import { CardSmall, ErrorComponent } from '@lib';
import { PeopleFormatted, text } from '@utils';
import { useFetchItemsQuery } from '../store/home-page-api.slice';
import {
  getIsSearchSyncronized,
  getSelectedItems,
  selectItem,
  setPagesNumber,
  unselectItem,
} from '../store/home-page.slice';
import './home-page-items.css';

interface HomePageItemsProps {
  locationSearch: string;
}

export const HomePageItems: FC<HomePageItemsProps> = ({ locationSearch }) => {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [searchParams] = useHomeSearch();

  const skip = !useAppSelector((state) => getIsSearchSyncronized(state));

  const { data, isLoading, isFetching, isError } = useFetchItemsQuery(
    searchParams,
    { skip }
  );

  const selectedItems = useAppSelector((state) => getSelectedItems(state));

  useEffect(() => {
    setTitle(
      searchParams.search
        ? `${text.homePage.resultTitleSearch} "${searchParams.search}"`
        : text.homePage.resultTitleFull
    );
  }, [searchParams.search]);

  useEffect(() => {
    if (data?.count) {
      const pagesNumber = data.next
        ? Math.ceil(data.count / data.results.length)
        : Number(searchParams.page) || 1;
      dispatch(setPagesNumber(pagesNumber));
    } else {
      dispatch(setPagesNumber(null));
    }
  }, [searchParams.page, data, dispatch]);

  useEffect(() => {
    dispatch(setPagesNumber(null));
  }, [isError, dispatch]);

  const handleItemClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  const handleSelectChange = (
    item: PeopleFormatted,
    e: FormEvent<HTMLInputElement>
  ) => {
    const { id, checked } = e.currentTarget;
    dispatch(checked ? selectItem({ item, id }) : unselectItem({ id }));
  };

  if (isError) {
    return (
      <ErrorComponent
        errorMessageInfo={text.homePage.loadingErrorMessageInfo}
      />
    );
  }

  if (isLoading || isFetching) {
    return <div className="home-content-empty"></div>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {!data?.itemsFormatted.length ? (
          <p>{text.homePage.emptyList}</p>
        ) : (
          <ul className="list">
            {data.itemsFormatted.map((item) => {
              const { id, name, details } = item;
              return (
                <li key={id} className="list-item-wrapper">
                  <input
                    type="checkbox"
                    className="d-none"
                    name="selected-items"
                    id={id}
                    checked={!!selectedItems[id]}
                    onChange={(e) => handleSelectChange(item, e)}
                  />
                  <label htmlFor={id} className="list-item-checkbox pointer">
                    <i
                      className={`icon-checkbox${selectedItems[id] ? '-checked' : ''}`}
                    ></i>
                  </label>
                  <NavLink
                    to={`${id}${locationSearch}`}
                    className={'list-item state-border'}
                    onClick={handleItemClick}
                  >
                    <CardSmall cardTitle={name} listOfDetails={details} />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
