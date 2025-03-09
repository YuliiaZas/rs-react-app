'use client';

import { FC, FormEvent, MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useHomeSearch } from '@context';
import { useAppDispatch, useAppSelector } from '@hooks';
import { CardSmall, ErrorComponent, Pagination } from '@lib';
import {
  getIsItemsLoading,
  getSelectedItems,
  selectItem,
  setIsItemsLoading,
  unselectItem,
} from '@store';
import {
  FetchResponce,
  getIdFromUrl,
  getStringifiedFilteredSearchParams,
  PATH_VALUE,
  PeopleFormatted,
  SearchResultFormatted,
  text,
} from '@utils';
import styles from './home-page-items.module.css';

interface HomePageItemsProps {
  itemsData: FetchResponce<SearchResultFormatted>;
}

export const HomePageItems: FC<HomePageItemsProps> = ({ itemsData }) => {
  const [searchParams, setSearchParams] = useHomeSearch();

  const router = useRouter();
  const pathname = usePathname() ?? '';
  const queryParams = getStringifiedFilteredSearchParams(searchParams);

  const dispatch = useAppDispatch();

  const [itemsFormatted, setItemsFormatted] = useState<PeopleFormatted[]>([]);
  const [isError, setIsError] = useState(false);
  const [title, setTitle] = useState('');
  const [pagesNumber, setPagesNumber] = useState<number | null>(null);
  const isLoading = useAppSelector((state) => getIsItemsLoading(state));

  const selectedItems = useAppSelector((state) => getSelectedItems(state));
  useEffect(() => {
    setItemsFormatted(itemsData.data?.itemsFormatted ?? []);
    setIsError(!!itemsData.error);
    dispatch(setIsItemsLoading(false));
  }, [dispatch, itemsData]);

  useEffect(() => {
    setTitle(
      searchParams.search
        ? `${text.homePage.resultTitleSearch} "${searchParams.search}"`
        : text.homePage.resultTitleFull
    );
  }, [searchParams.search]);

  useEffect(() => {
    if (itemsData.data?.count) {
      const pagesNumber = itemsData.data.next
        ? Math.ceil(itemsData.data.count / itemsData.data.results.length)
        : Number(searchParams.page) || 1;
      setPagesNumber(pagesNumber);
    } else {
      setPagesNumber(null);
    }
  }, [searchParams.page, itemsData.data]);

  useEffect(() => {
    if (itemsData.error) setPagesNumber(null);
  }, [itemsData.error]);

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

  const handlePageNumberClick = (page: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSearchParams = { ...searchParams, page };
    if (getIdFromUrl(pathname ?? '')) {
      router.push(
        PATH_VALUE.HOME +
          '?' +
          getStringifiedFilteredSearchParams(newSearchParams)
      );
    } else {
      setSearchParams(newSearchParams);
    }
    dispatch(setIsItemsLoading(true));
  };

  const getLinkHref = (id: string): string => {
    const href = `${PATH_VALUE.HOME}/${id}?${queryParams}`;
    return href;
  };

  const isActive = (id: string) => {
    return pathname === `${PATH_VALUE.HOME}/${id}`;
  };

  if (isError) {
    return (
      <ErrorComponent
        errorMessageInfo={text.homePage.loadingErrorMessageInfo}
      />
    );
  }

  if (isLoading && !itemsFormatted.length) {
    return <div className="home-content-empty"></div>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {!itemsFormatted.length ? (
          <p>{text.homePage.emptyList}</p>
        ) : (
          <>
            <ul className={styles.list}>
              {itemsFormatted.map((item) => {
                const { id, name, details } = item;
                return (
                  <li key={id} className={styles['list-item-wrapper']}>
                    <input
                      type="checkbox"
                      className="d-none"
                      name="selected-items"
                      id={id}
                      checked={!!selectedItems[id]}
                      onChange={(e) => handleSelectChange(item, e)}
                    />
                    <label
                      htmlFor={id}
                      className={styles['list-item-checkbox']}
                    >
                      <i
                        className={`icon-checkbox${selectedItems[id] ? '-checked' : ''}`}
                      ></i>
                    </label>
                    <Link
                      href={getLinkHref(id)}
                      className={`${styles['list-item']} state-border ${isActive(id) ? 'active' : ''}`}
                      onClick={handleItemClick}
                    >
                      <CardSmall cardTitle={name} listOfDetails={details} />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Pagination
              pagesNumber={pagesNumber}
              currentPage={searchParams.page}
              onClick={handlePageNumberClick}
            />
          </>
        )}
      </div>
    </div>
  );
};
