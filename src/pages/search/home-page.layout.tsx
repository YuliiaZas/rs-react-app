import { FC, useEffect, useState } from 'react';
import { Outlet, redirect, useLocation, useNavigate } from 'react-router';
import { HomePageItems, HomePageSave, HomePageSearch } from '@home-components';
import { useAppSelector } from '@hooks';
import { Spinner } from '@lib';
import { peopleService } from '@services';
import { getIsItemsLoading } from '@store';
import {
  FetchResponce,
  getFilteredParams,
  isStringifiedNumberValid,
  PATH_VALUE,
  SearchResultFormatted,
  text,
} from '@utils';
import type { Route } from './+types/search';
import styles from './home-page.module.css';

export async function loader({ request, params }: Route.LoaderArgs) {
  if (params.id && !isStringifiedNumberValid(params.id)) {
    return redirect('/404');
  }
  const searchParams = new URL(request.url).searchParams;
  return await peopleService.getItems(getFilteredParams(searchParams));
}

const HomePage: FC<FetchResponce<SearchResultFormatted>> = ({
  loaderData,
}: Route.ComponentProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isItemsLoading = useAppSelector((state) => getIsItemsLoading(state));

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (showError) throwError();
  }, [showError]);

  const handleGlobalHomePageClick = () => {
    if (location.pathname !== PATH_VALUE.HOME) {
      closeOutlet();
    }
  };

  const closeOutlet = () => {
    navigate(`${PATH_VALUE.HOME}${location.search}`);
  };

  const showPageError = () => {
    setShowError(true);
  };

  const throwError = () => {
    throw new Error('Error, thrown by clicking the "Throw Error" button');
  };

  return (
    <>
      <div className={styles['home-wrapper']}>
        <main
          className={styles['home-main']}
          onClick={handleGlobalHomePageClick}
        >
          <section className={styles['home-search']}>
            <HomePageSearch />
          </section>
          <section className={styles['home-content']}>
            <h1 className={styles['home-content-title']}>
              {text.homePage.title}
            </h1>
            <section className={styles['home-content-wrapper']}>
              <div className={styles['home-content-card']}>
                <HomePageItems itemsData={loaderData} />
              </div>
            </section>
          </section>
          <section className={styles['home-error']}>
            <button
              className={styles['home-error-button']}
              onClick={showPageError}
            >
              {text.homePage.throwErrorButton}
            </button>
          </section>
          <HomePageSave />
        </main>
        <aside className={styles['home-details']}>
          <Outlet />
        </aside>
      </div>
      {isItemsLoading && <Spinner global={true} />}
    </>
  );
};

export default HomePage;
