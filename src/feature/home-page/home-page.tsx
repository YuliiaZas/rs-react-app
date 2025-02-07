import { FC, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useCurrentSearchParams } from '@hooks';
import { ErrorComponent, Search, Spinner } from '@lib';
import { peopleService } from '@services';
import { LOADING_STATE, PATH_VALUE, People, SearchResult } from '@utils';
import { HomePageItems } from './home-page-items/home-page-items';
import { HomePageDetailsProps } from './home-page-details/home-page-details';
import './home-page.css';

const pageTitle = 'People of Star Wars';
const resultTitleFull = 'Full list (1 page)';
const resultTitleSearch = 'Search result for';
const errorMessageInfo = 'Please, try one more time';
const searchPlaceholder = 'Input Name from Star Wars';
const throwErrorButtonText = 'Trow Error';

export const HomePage: FC = () => {
  const [title, setTitle] = useState('');
  const [loadingState, setLoadingState] = useState(LOADING_STATE.PRESTINE);
  const [items, setItems] = useState<People[]>([]);
  const [showError, setShowError] = useState(false);
  const [repeatRequestTimestamp, setRepeatRequestTimestamp] = useState(0);

  const [searchParams, setSearchParams] = useCurrentSearchParams();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setTitle(
      searchParams.search
        ? `${resultTitleSearch} "${searchParams.search}"`
        : resultTitleFull
    );
  }, [searchParams.search]);

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
  }, [searchParams, repeatRequestTimestamp]);

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

  const updateItems = (data: SearchResult<People>) => {
    setLoadingState(LOADING_STATE.LOADED);
    setItems(data?.results || []);
  };

  const showDataError = (e: Error) => {
    console.log(e);
    setLoadingState(LOADING_STATE.FAILURE);
    setItems([]);
  };

  const handlePageClick = () => {
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
        <div className="home-main" onClick={handlePageClick}>
          <section className="home-seach">
            <Search
              initialSearchValue={searchParams.search}
              updateSearchValue={updateSearchValue}
              placeholder={searchPlaceholder}
            />
          </section>
          <section className="home-content">
            <h1 className="home-content-title">{pageTitle}</h1>
            <section className="home-content-card">
              {loadingState === LOADING_STATE.FAILURE ? (
                <ErrorComponent errorMessageInfo={errorMessageInfo} />
              ) : loadingState === LOADING_STATE.LOADING ? (
                <div className="home-content-card-empty"></div>
              ) : (
                <HomePageItems
                  title={title}
                  items={items}
                  locationSearch={location.search}
                />
              )}
            </section>
          </section>
          <section className="home-error">
            <button className="home-error-button" onClick={showPageError}>
              {throwErrorButtonText}
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
