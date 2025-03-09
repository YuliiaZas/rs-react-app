import { FC, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import {
  HomePageDetails,
  HomePageItems,
  HomePageSave,
  HomePageSearch,
} from '@home-components';
import { useAppSelector } from '@hooks';
import { Spinner } from '@lib';
import { ScrollLayout } from '@layout';
import { peopleService } from '@services';
import { getIsItemsLoading } from '@store';
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

export type HomePageProps = {
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

  const detailsId = slugs[0];
  if (!detailsId) return { props };

  return {
    props: {
      ...props,
      item: await peopleService.getItem(detailsId),
    },
  };
};

const HomePage: FC<HomePageProps> = (props) => {
  const router = useRouter();

  const isItemsLoading = useAppSelector((state) => getIsItemsLoading(state));

  const [isItemLoading, setItemLoading] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(!!props.item);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setItemLoading(false);
  }, [props.item]);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      const isRedirectToDetails = !!getIdFromUrl(url);
      setIsDetailsVisible(isRedirectToDetails);
      if (isRedirectToDetails) {
        setItemLoading(true);
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router.events]);

  useEffect(() => {
    if (showError) throwError();
  }, [showError]);

  const handleGlobalHomePageClick = () => {
    if (router.query.slug) {
      closeOutlet();
    }
  };

  const closeOutlet = () => {
    router.push({
      pathname: PATH_VALUE.HOME,
      query: getFilteredParams(router.query),
    });
  };

  const showPageError = () => {
    setShowError(true);
  };

  const throwError = () => {
    throw new Error('Error, thrown by clicking the "Throw Error" button');
  };

  return (
    <ScrollLayout>
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
                <HomePageItems itemsData={props.items} />
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
              itemData={props.item}
              isLoading={isItemLoading}
              closeFn={closeOutlet}
            ></HomePageDetails>
          )}
        </aside>
      </div>
      {isItemsLoading && <Spinner global={true} />}
    </ScrollLayout>
  );
};

export default HomePage;
