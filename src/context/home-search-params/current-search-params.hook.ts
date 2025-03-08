'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useLocalStorage, useRunOnce } from '@hooks';
import {
  CurrentSearchParams,
  getFilteredParams,
  getStringifiedFilteredSearchParams,
} from '@utils';
import { setIsItemsLoading, unselectAll } from '@store';

export function useCurrentSearchParams(): [
  CurrentSearchParams,
  React.Dispatch<CurrentSearchParams>,
] {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [homePageSearchLS, setHomePageSearchLS] =
    useLocalStorage<CurrentSearchParams>({
      key: 'homePageSearch',
      defaultValue: {},
    });

  useRunOnce({
    fn: () => {
      if (!searchParams) {
        router.replace(
          pathname ??
            '/' + '?' + getStringifiedFilteredSearchParams(homePageSearchLS)
        );
        dispatch(setIsItemsLoading(true));
      }
    },
  });

  useEffect(() => {
    if (!router || !pathname || !searchParams) return;

    const filteredParams = getFilteredParams(searchParams ?? {});
    if (JSON.stringify(filteredParams) !== JSON.stringify(homePageSearchLS)) {
      setHomePageSearchLS(filteredParams);
    }
  }, [router, pathname, searchParams, homePageSearchLS, setHomePageSearchLS]);

  useEffect(() => {
    dispatch(unselectAll());
  }, [dispatch, homePageSearchLS.search]);

  const setCurrentSearchParams: React.Dispatch<CurrentSearchParams> = (
    params: CurrentSearchParams
  ) => {
    if (!router || !pathname) return;

    router.push(pathname + '?' + getStringifiedFilteredSearchParams(params));
  };

  return [homePageSearchLS, setCurrentSearchParams];
}
