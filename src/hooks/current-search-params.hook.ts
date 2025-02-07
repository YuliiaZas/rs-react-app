import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useLocalStorage } from './local-storage.hook';
import { useRunOnce } from './run-once.hook';

export type CurrentSearchParams = {
  search: string;
  page?: string;
};

function getFilteredParam(params: CurrentSearchParams): CurrentSearchParams {
  const filteredParam: CurrentSearchParams = { search: params.search ?? '' };
  if (params.page) {
    filteredParam.page = params.page;
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
      defaultValue: { search: '' },
    });

  useRunOnce({ fn: () => setQuery(homePageSearchLS) });

  useEffect(
    () =>
      setHomePageSearchLS(
        Object.fromEntries(query.entries()) as CurrentSearchParams
      ),
    [query, setHomePageSearchLS]
  );

  const setCurrentSearchParams = useCallback(
    (params: CurrentSearchParams) => setQuery(getFilteredParam(params)),
    [setQuery]
  );

  return [homePageSearchLS, setCurrentSearchParams];
}
