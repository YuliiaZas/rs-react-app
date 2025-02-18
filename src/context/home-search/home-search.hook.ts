import { useContext } from 'react';
import { HomeSearchContext } from './home-search.context';

export const useHomeSearch = () => useContext(HomeSearchContext);
