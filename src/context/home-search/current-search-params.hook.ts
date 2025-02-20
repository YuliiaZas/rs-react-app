import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { setSearchIsSyncronized, unselectAll } from '@home-page';
import { useAppDispatch, useLocalStorage, useRunOnce } from '@hooks';
import { CurrentSearchParams } from '@utils';

function getFilteredParams(params: CurrentSearchParams): CurrentSearchParams {
  return {
    ...(params.search && { search: params.search }),
    ...(params.page && { page: params.page }),
  };
}

function getFilteredParamsFromQuery(
  query: URLSearchParams
): CurrentSearchParams {
  return {
    ...(query.get('search') && { search: query.get('search') as string }),
    ...(query.get('page') && { page: query.get('page') as string }),
  };
}

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
      }
      dispatch(setSearchIsSyncronized());
    },
  });

  useEffect(() => {
    const filteredParams = getFilteredParamsFromQuery(query);
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
