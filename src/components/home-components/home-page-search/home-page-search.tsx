import { FunctionComponent } from 'react';
import { useHomeSearch } from '@context';
import { useAppDispatch } from '@hooks';
import { Search } from '@lib';
import { setIsItemsLoading } from '@store';
import { text } from '@utils';

export const HomePageSearch: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useHomeSearch();

  const updateSearchValue = (currentSearchValue: string) => {
    const trimmedSeachValue = currentSearchValue.trim();

    if (trimmedSeachValue !== searchParams.search) {
      setSearchParams({ search: trimmedSeachValue });
      dispatch(setIsItemsLoading(true));
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
