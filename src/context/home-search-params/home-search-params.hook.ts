import { useContext } from 'react';
import { HomeSearchParamsContext } from './home-search-params.context';

export const useHomeSearch = () => useContext(HomeSearchParamsContext);
