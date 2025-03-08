'use client';

import React, { FC, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { HomePageSave, HomePageSearch } from '@home-components';
import { useAppSelector } from '@hooks';
import { Spinner } from '@lib';
import { getIsItemsLoading } from '@store';
import {
  getIdFromUrl,
  getStringifiedFilteredSearchParams,
  PATH_VALUE,
  text,
} from '@utils';
import styles from './home-page.module.css';

export type HomePageProps = {
  items: React.ReactNode;
  item: React.ReactNode;
};

const HomeLayout: FC<HomePageProps> = ({ items, item }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams() ?? {};

  const isItemsLoading = useAppSelector((state) => getIsItemsLoading(state));

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (showError) throwError();
  }, [showError]);

  const handleGlobalHomePageClick = () => {
    if (getIdFromUrl(pathname ?? '')) {
      closeOutlet();
    }
  };

  const closeOutlet = () => {
    router.push(
      PATH_VALUE.HOME + '?' + getStringifiedFilteredSearchParams(searchParams)
    );
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
              <div className={styles['home-content-card']}>{items}</div>
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
        <aside className={styles['home-details']}>{item}</aside>
      </div>
      {isItemsLoading && <Spinner global={true} />}
    </>
  );
};

export default HomeLayout;
