import { useCallback, useEffect } from 'react';
import { useAppDispatch, useLocalStorage, useRunOnce } from '@hooks';
import { CurrentSearchParams, getFilteredParams } from '@utils';
import { setIsItemsLoading, unselectAll } from '@store';
import { useSearchParams } from 'react-router';

export function useCurrentSearchParams(): [
  CurrentSearchParams,
  React.Dispatch<CurrentSearchParams>,
] {
  const dispatch = useAppDispatch();

  const [query, setQuery] = useSearchParams();

  const [homePageSearchLS, setHomePageSearchLS] =
    useLocalStorage<CurrentSearchParams>({
      key: 'homePageSearch',
      defaultValue: {},
    });

  useRunOnce({
    fn: () => {
      if (query.size === 0) {
        setQuery(homePageSearchLS);
        dispatch(setIsItemsLoading(true));
      }
    },
  });

  useEffect(() => {
    const filteredParams = getFilteredParams(query);
    if (JSON.stringify(filteredParams) !== JSON.stringify(homePageSearchLS)) {
      setHomePageSearchLS(filteredParams);
    }
  }, [query, homePageSearchLS, setHomePageSearchLS]);

  useEffect(() => {
    dispatch(unselectAll());
  }, [dispatch, homePageSearchLS.search]);

  const setCurrentSearchParams = useCallback(
    (params: CurrentSearchParams) => setQuery(getFilteredParams(params)),
    [setQuery]
  );

  return [homePageSearchLS, setCurrentSearchParams];
}
