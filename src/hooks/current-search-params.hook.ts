import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useLocalStorage } from './local-storage.hook';
import { useRunOnce } from './run-once.hook';

export type CurrentSearchParams = {
  search?: string;
  page?: string;
};

function getFilteredParams(params: CurrentSearchParams): CurrentSearchParams {
  const filteredParam: CurrentSearchParams = params.search
    ? { search: params.search }
    : {};
  if (params.page) {
    filteredParam.page = params.page;
  }
  return filteredParam;
}

function getFilteredParamsFromQuery(
  query: URLSearchParams
): CurrentSearchParams {
  const filteredParam: CurrentSearchParams = query.get('search')
    ? { search: query.get('search') as string }
    : {};
  if (query.get('page')) {
    filteredParam.page = query.get('page') as string;
  }
  return filteredParam;
}

export function useCurrentSearchParams(): [
  CurrentSearchParams,
  React.Dispatch<CurrentSearchParams>,
] {
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
      } else {
        setHomePageSearchLS(getFilteredParamsFromQuery(query));
      }
    },
  });

  useEffect(
    () => setHomePageSearchLS(getFilteredParamsFromQuery(query)),
    [query, setHomePageSearchLS]
  );

  const setCurrentSearchParams = useCallback(
    (params: CurrentSearchParams) => setQuery(getFilteredParams(params)),
    [setQuery]
  );

  return [homePageSearchLS, setCurrentSearchParams];
}
