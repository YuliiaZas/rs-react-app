import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useLocalStorage, useRunOnce } from '@hooks';
import { CurrentSearchParams, getFilteredParams } from '@utils';
import { setIsItemsLoading, unselectAll } from '@store';

export function useCurrentSearchParams(): [
  CurrentSearchParams,
  React.Dispatch<CurrentSearchParams>,
] {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [homePageSearchLS, setHomePageSearchLS] =
    useLocalStorage<CurrentSearchParams>({
      key: 'homePageSearch',
      defaultValue: {},
    });

  useRunOnce({
    fn: () => {
      if (Object.entries(router.query).length === 0) {
        router.replace({
          query: getFilteredParams(homePageSearchLS),
        });
        dispatch(setIsItemsLoading(true));
      }
    },
  });

  useEffect(() => {
    const filteredParams = getFilteredParams(router.query);
    if (JSON.stringify(filteredParams) !== JSON.stringify(homePageSearchLS)) {
      setHomePageSearchLS(filteredParams);
    }
  }, [router.query, homePageSearchLS, setHomePageSearchLS]);

  useEffect(() => {
    dispatch(unselectAll());
  }, [dispatch, homePageSearchLS.search]);

  const setCurrentSearchParams: React.Dispatch<CurrentSearchParams> = (
    params: CurrentSearchParams
  ) => {
    router.push({
      pathname: router.pathname,
      query: getFilteredParams(params),
    });
  };

  return [homePageSearchLS, setCurrentSearchParams];
}
