import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { CurrentSearchParams } from '@utils';
import { useLocalStorage, useRunOnce } from '@hooks';

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
    },
  });

  useEffect(() => {
    const filteredParams = getFilteredParamsFromQuery(query);
    console.log(
      'effect - ',
      JSON.stringify(filteredParams) !== JSON.stringify(homePageSearchLS),
      JSON.stringify(filteredParams),
      JSON.stringify(homePageSearchLS)
    );
    if (JSON.stringify(filteredParams) !== JSON.stringify(homePageSearchLS)) {
      setHomePageSearchLS(filteredParams);
    }
  }, [query, homePageSearchLS, setHomePageSearchLS]);

  const setCurrentSearchParams = useCallback(
    (params: CurrentSearchParams) => setQuery(getFilteredParams(params)),
    [setQuery]
  );

  return [homePageSearchLS, setCurrentSearchParams];
}
