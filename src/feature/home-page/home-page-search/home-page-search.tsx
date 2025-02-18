import { FunctionComponent } from 'react';
import { useHomeSearch } from '@context';
import { Search } from '@lib';
import { text } from '@utils';

const HomePageSearch: FunctionComponent = () => {
  const [searchParams, setSearchParams] = useHomeSearch();

  const updateSearchValue = (currentSearchValue: string) => {
    const trimmedSeachValue = currentSearchValue.trim();

    if (trimmedSeachValue !== searchParams.search) {
      setSearchParams({ search: trimmedSeachValue });
    }
  };

  return (
    <Search
      initialSearchValue={searchParams.search ?? ''}
      updateSearchValue={updateSearchValue}
      placeholder={text.homePage.searchPlaceholder}
    />
  );
};

export default HomePageSearch;
