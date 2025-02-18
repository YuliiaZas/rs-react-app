import { FC, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useHomeSearch } from '@context';
import { useAppDispatch, useAppSelector } from '@hooks';
import { Pagination, Spinner } from '@lib';
import { PATH_VALUE, text } from '@utils';
import { HomePageItems } from './home-page-items/home-page-items';
import { HomePageDetailsProps } from './home-page-details/home-page-details';
import HomePageSearch from './home-page-search/home-page-search';
import {
  getIsItemsLoading,
  getPagesNumber,
  setSearch,
} from './store/home-page.slice';
import './home-page.css';

export const HomePage: FC = () => {
  const dispatch = useAppDispatch();

  const [showError, setShowError] = useState(false);

  const [searchParams, setSearchParams] = useHomeSearch();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(setSearch(searchParams));
  }, [dispatch, searchParams]);

  const pagesNumber = useAppSelector((state) => getPagesNumber(state));
  const isItemsLoading = useAppSelector((state) => getIsItemsLoading(state));

  useEffect(() => {
    if (showError) throwError();
  }, [showError]);

  const handlePageNumberClick = (page: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchParams({ ...searchParams, page });

    if (location.pathname !== PATH_VALUE.HOME) {
      navigate({
        pathname: PATH_VALUE.HOME,
        search: new URLSearchParams({ ...searchParams, page }).toString(),
      });
    }
  };

  const handleGlobalPageClick = () => {
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
      <div className="home-wrapper">
        <main className="home-main" onClick={handleGlobalPageClick}>
          <section className="home-seach">
            <HomePageSearch />
          </section>
          <section className="home-content">
            <h1 className="home-content-title">{text.homePage.title}</h1>
            <section className="home-content-wrapper">
              <div className="home-content-card">
                <HomePageItems locationSearch={location.search} />
                {!isItemsLoading && (
                  <Pagination
                    pagesNumber={pagesNumber}
                    currentPage={searchParams.page}
                    onClick={handlePageNumberClick}
                  />
                )}
              </div>
            </section>
          </section>
          <section className="home-error">
            <button className="home-error-button" onClick={showPageError}>
              {text.homePage.throwErrorButton}
            </button>
          </section>
        </main>
        <aside className="home-details">
          <Outlet
            key={location.pathname}
            context={{ closeFn: closeOutlet } satisfies HomePageDetailsProps}
          />
        </aside>
      </div>
      {isItemsLoading && <Spinner />}
    </>
  );
};
