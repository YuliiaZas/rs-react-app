import { FC, useEffect, useState } from 'react';
import { useLocalStorage } from '@hooks';
import { ErrorComponent, Search, Spinner } from '@lib';
import { peopleService } from '@services';
import { LOADING_STATE, People, SearchResult } from '@utils';
import { HomePageItems } from './home-page-items/home-page-items';
import './home-page.css';

export const HomePage: FC = () => {
  const pageTitle = 'People of Star Wars';
  const resultTitleFull = 'Full list (1 page)';
  const resultTitleSearch = 'Search result for';
  const errorMessageInfo = 'Please, try one more time';
  const searchPlaceholder = 'Input Name from Star Wars';
  const throwErrorButtonText = 'Trow Error';

  const [searchValue, setSearchValue] = useLocalStorage({ defaultValue: '' });
  const [title, setTitle] = useState('');
  const [loadingState, setLoadingState] = useState(LOADING_STATE.PRESTINE);
  const [items, setItems] = useState<People[]>([]);
  const [showError, setShowError] = useState(false);
  const [repeatRequestTimestamp, setRepeatRequestTimestamp] = useState(0);

  useEffect(() => {
    setTitle(
      searchValue ? `${resultTitleSearch} "${searchValue}"` : resultTitleFull
    );
  }, [searchValue]);

  useEffect(() => {
    let subscribed = true;
    console.log(repeatRequestTimestamp);

    setLoadingState(LOADING_STATE.LOADING);

    peopleService
      .getItems(searchValue)
      .then((data: SearchResult<People>) => subscribed && updateItems(data))
      .catch(() => subscribed && showDataError());

    return () => {
      subscribed = false;
    };
  }, [searchValue, repeatRequestTimestamp]);

  useEffect(() => {
    if (showError) throwError();
  }, [showError]);

  const updateSearchValue = (currentSearchValue: string) => {
    const trimmedSeachValue = currentSearchValue.trim();

    if (trimmedSeachValue !== searchValue) {
      setSearchValue(trimmedSeachValue);
    } else {
      setRepeatRequestTimestamp(Date.now());
    }
  };

  const updateItems = (data: SearchResult<People>) => {
    setLoadingState(LOADING_STATE.LOADED);
    setItems(data?.results || []);
  };

  const showDataError = () => {
    setLoadingState(LOADING_STATE.FAILURE);
    setItems([]);
  };

  const showPageError = () => {
    setShowError(true);
  };

  const throwError = () => {
    throw new Error('Error, thrown by clicking the "Throw Error" button');
  };

  return (
    <>
      <main className="home-main">
        <section className="home-seach">
          <Search
            initialSearchValue={searchValue}
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
              <HomePageItems title={title} items={items} />
            )}
          </section>
        </section>
        <section className="home-error">
          <button className="home-error-button" onClick={showPageError}>
            {throwErrorButtonText}
          </button>
        </section>
      </main>
      {loadingState === LOADING_STATE.LOADING && <Spinner />}
    </>
  );
};
