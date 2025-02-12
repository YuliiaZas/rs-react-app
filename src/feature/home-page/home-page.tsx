import { FC, useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCurrentSearchParams } from '@hooks';
import { ErrorComponent, Pagination, Search, Spinner } from '@lib';
import { peopleService } from '@services';
import { LOADING_STATE, PATH_VALUE, People, SearchResult, text } from '@utils';
import { HomePageItems } from './home-page-items/home-page-items';
import { HomePageDetailsProps } from './home-page-details/home-page-details';
import './home-page.css';

export const HomePage: FC = () => {
  const [title, setTitle] = useState('');
  const [loadingState, setLoadingState] = useState(LOADING_STATE.PRESTINE);
  const [items, setItems] = useState<People[]>([]);
  const [pagesNumber, setPagesNumber] = useState(1);
  const [showError, setShowError] = useState(false);
  const [repeatRequestTimestamp, setRepeatRequestTimestamp] = useState(0);

  const [searchParams, setSearchParams] = useCurrentSearchParams();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setTitle(
      searchParams.search
        ? `${text.homePage.resultTitleSearch} "${searchParams.search}"`
        : text.homePage.resultTitleFull
    );
  }, [searchParams.search]);

  const updateItems = useCallback(
    (data: SearchResult<People>) => {
      setLoadingState(LOADING_STATE.LOADED);
      setItems(data?.results || []);
      if (data.next) {
        setPagesNumber(Math.ceil(data?.count / data?.results.length) || 1);
      } else {
        setPagesNumber(Number(searchParams.page) || 1);
      }
    },
    [searchParams.page]
  );

  useEffect(() => {
    let subscribed = true;

    setLoadingState(LOADING_STATE.LOADING);

    peopleService
      .getItems(searchParams)
      .then((data: SearchResult<People>) => subscribed && updateItems(data))
      .catch((e) => subscribed && showDataError(e));

    return () => {
      subscribed = false;
    };
  }, [searchParams, repeatRequestTimestamp, updateItems]);

  useEffect(() => {
    if (showError) throwError();
  }, [showError]);

  const updateSearchValue = (currentSearchValue: string) => {
    const trimmedSeachValue = currentSearchValue.trim();

    if (trimmedSeachValue !== searchParams.search) {
      setSearchParams({ search: trimmedSeachValue });
    } else {
      setRepeatRequestTimestamp(Date.now());
    }
  };

  const showDataError = (e: Error) => {
    console.log(e);
    setLoadingState(LOADING_STATE.FAILURE);
    setItems([]);
    setPagesNumber(1);
  };

  const handlePageNumberClick = (page: string) => {
    setSearchParams({ ...searchParams, page });
  };

  const handleGlobalPageClick = () => {
    if (location.pathname !== PATH_VALUE.HOME) {
      closeDetails();
    }
  };

  const closeDetails = () => {
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
      <main className="home-wrapper">
        <div className="home-main" onClick={handleGlobalPageClick}>
          <section className="home-seach">
            <Search
              initialSearchValue={searchParams.search}
              updateSearchValue={updateSearchValue}
              placeholder={text.homePage.searchPlaceholder}
            />
          </section>
          <section className="home-content">
            <h1 className="home-content-title">{text.homePage.title}</h1>
            <section className="home-content-wrapper">
              {loadingState === LOADING_STATE.FAILURE ? (
                <ErrorComponent
                  errorMessageInfo={text.homePage.loadingErrorMessageInfo}
                />
              ) : loadingState === LOADING_STATE.LOADING ? (
                <div className="home-content-empty"></div>
              ) : (
                <div className="home-content-card">
                  <HomePageItems
                    title={title}
                    items={items}
                    locationSearch={location.search}
                  />
                  <Pagination
                    pagesNumber={pagesNumber}
                    currentPage={searchParams.page}
                    onClick={handlePageNumberClick}
                  />
                </div>
              )}
            </section>
          </section>
          <section className="home-error">
            <button className="home-error-button" onClick={showPageError}>
              {text.homePage.throwErrorButton}
            </button>
          </section>
        </div>
        <div className="home-details">
          <Outlet
            context={{ closeFn: closeDetails } satisfies HomePageDetailsProps}
          />
        </div>
      </main>
      {loadingState === LOADING_STATE.LOADING && <Spinner />}
    </>
  );
};
