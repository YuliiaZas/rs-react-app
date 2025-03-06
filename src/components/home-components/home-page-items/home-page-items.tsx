import { FC, FormEvent, MouseEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@hooks';
import { CardSmall, ErrorComponent } from '@lib';
import { getSelectedItems, selectItem, unselectItem } from '@store';
import { PeopleFormatted, text } from '@utils';
import styles from './home-page-items.module.css';

interface HomePageItemsProps {
  items: PeopleFormatted[];
  title: string;
  isLoading: boolean;
  isError: boolean;
}

export const HomePageItems: FC<HomePageItemsProps> = ({
  items,
  title,
  isLoading,
  isError,
}) => {
  const router = useRouter();
  const basePath = router.pathname.split('/').slice(0, -1).join('/');
  const queryParamsWithoutSlug = new URLSearchParams(
    Object.entries(router.query).reduce(
      (acc, [key, value]) => {
        if (key !== 'slug') {
          acc[key] = value as string;
        }
        return acc;
      },
      {} as Record<string, string>
    )
  ).toString();

  const dispatch = useAppDispatch();

  const selectedItems = useAppSelector((state) => getSelectedItems(state));

  const getLinkHref = (id: string): string => {
    const href = `${basePath}/${id}?${queryParamsWithoutSlug}`;
    return href;
  };

  const isActive = (id: string) => {
    return router.asPath === `${basePath}/${id}${queryParamsWithoutSlug}`;
  };

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

  if (isLoading && !items.length) {
    return <div className="home-content-empty"></div>;
  }

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {!items.length ? (
          <p>{text.homePage.emptyList}</p>
        ) : (
          <ul className={styles.list}>
            {items.map((item) => {
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
                  <label htmlFor={id} className={styles['list-item-checkbox']}>
                    <i
                      className={`icon-checkbox${selectedItems[id] ? '-checked' : ''}`}
                    ></i>
                  </label>
                  <Link
                    href={getLinkHref(id)}
                    className={`${styles['list-item']} state-border ${isActive(id) ? styles.active : ''}`}
                    onClick={handleItemClick}
                  >
                    <CardSmall cardTitle={name} listOfDetails={details} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
