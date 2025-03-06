import { FC, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useHomeSearch } from '@context';
import {
  HomePageDetails,
  HomePageItems,
  HomePageSave,
  HomePageSearch,
} from '@home-components';
import { useAppDispatch, useAppSelector } from '@hooks';
import { Pagination, Spinner } from '@lib';
import { peopleService } from '@services';
import { getIsItemsLoading, setIsItemsLoading } from '@store';
import {
  FetchResponce,
  getFilteredParams,
  getIdFromUrl,
  isStringifiedNumberValid,
  PATH_VALUE,
  PeopleFormatted,
  SearchResultFormatted,
  text,
} from '@utils';
import styles from './home-page.module.css';

type HomePageProps = {
  items: FetchResponce<SearchResultFormatted>;
  item?: FetchResponce<PeopleFormatted | null>;
};

const isUrlValid = (slugs: string | string[]): boolean => {
  return (
    Array.isArray(slugs) &&
    (slugs.length === 0 ||
      (slugs.length === 1 && isStringifiedNumberValid(slugs[0])))
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const slugs = query.slug ?? [];
  if (!isUrlValid(slugs)) return { notFound: true };

  const props: HomePageProps = {
    items: await peopleService.getItems(getFilteredParams(query)),
  };

  const dateilsId = slugs[0];
  if (dateilsId) {
    return {
      props: {
        ...props,
        item: await peopleService.getItem(dateilsId),
      },
    };
  }
  return { props };
};

const HomePage: FC<HomePageProps> = (props) => {
  const {
    items: { data: itemsData, error: itemsFetchError },
  } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [searchParams, setSearchParams] = useHomeSearch();

  const [showError, setShowError] = useState(false);

  const [scrollPosition, setScrollPosition] = useState(0);

  const [title, setTitle] = useState('');
  const [pagesNumber, setPagesNumber] = useState<number | null>(null);

  const [itemsFormatted, setItemsFormatted] = useState<PeopleFormatted[]>([]);
  const isItemsLoading = useAppSelector((state) => getIsItemsLoading(state));
  const [isItemsError, setItemsError] = useState(false);

  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [item, setItem] = useState<PeopleFormatted | null>(null);
  const [isItemLoading, setItemLoading] = useState(false);
  const [isItemError, setItemError] = useState(false);

  useEffect(() => {
    setItem(props.item?.data ?? null);
    setItemError(!!props.item?.error);
    setItemLoading(false);
  }, [props.item]);

  useEffect(() => {
    setItemsFormatted(props.items.data?.itemsFormatted ?? []);
    setItemsError(!!props.items.error);
    dispatch(setIsItemsLoading(false));
  }, [dispatch, props.items]);

  useEffect(() => {
    setTitle(
      searchParams.search
        ? `${text.homePage.resultTitleSearch} "${searchParams.search}"`
        : text.homePage.resultTitleFull
    );
  }, [searchParams.search]);

  useEffect(() => {
    if (itemsData?.count) {
      const pagesNumber = itemsData.next
        ? Math.ceil(itemsData.count / itemsData.results.length)
        : Number(searchParams.page) || 1;
      setPagesNumber(pagesNumber);
    } else {
      setPagesNumber(null);
    }
  }, [searchParams.page, itemsData]);

  useEffect(() => {
    if (itemsFetchError) setPagesNumber(null);
  }, [itemsFetchError]);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      const isRedirectToDetails = !!getIdFromUrl(url);
      if (isRedirectToDetails) setItemLoading(true);
      setIsDetailsVisible(isRedirectToDetails);

      setScrollPosition(window.scrollY);
    };

    const handleRouteChangeComplete = () => {
      if (isDetailsVisible) window.scrollTo(0, scrollPosition);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events, isDetailsVisible, scrollPosition]);

  useEffect(() => {
    if (showError) throwError();
  }, [showError]);

  const handlePageNumberClick = (page: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchParams({ ...searchParams, page });
    dispatch(setIsItemsLoading(true));
  };

  const handleGlobalHomePageClick = () => {
    if (router.query.slug) {
      closeOutlet();
    }
  };

  const closeOutlet = () => {
    router.push({
      pathname: PATH_VALUE.HOME,
      query: searchParams,
    });
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
                <HomePageItems
                  items={itemsFormatted}
                  title={title}
                  isLoading={isItemsLoading}
                  isError={isItemsError}
                />
                <Pagination
                  pagesNumber={pagesNumber}
                  currentPage={searchParams.page}
                  onClick={handlePageNumberClick}
                />
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
          {isDetailsVisible && (
            <HomePageDetails
              closeFn={closeOutlet}
              data={item}
              isLoading={isItemLoading}
              isError={isItemError}
            ></HomePageDetails>
          )}
        </aside>
      </div>
      {isItemsLoading && <Spinner />}
    </>
  );
};

export default HomePage;
