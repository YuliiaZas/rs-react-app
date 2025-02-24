import { PropsWithChildren } from 'react';
import { useCurrentSearchParams } from './current-search-params.hook';
import { HomeSearchParamsContext } from './home-search-params.context';

export const HomeSearchParamsProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useCurrentSearchParams();

  return (
    <HomeSearchParamsContext.Provider value={[searchParams, setSearchParams]}>
      {children}
    </HomeSearchParamsContext.Provider>
  );
};
