import { PropsWithChildren } from 'react';
import { useCurrentSearchParams } from './current-search-params.hook';
import { HomeSearchContext } from './home-search.context';

export const HomeSearchProvider = ({ children }: PropsWithChildren) => {
  const [searchParams, setSearchParams] = useCurrentSearchParams();

  return (
    <HomeSearchContext.Provider value={[searchParams, setSearchParams]}>
      {children}
    </HomeSearchContext.Provider>
  );
};
