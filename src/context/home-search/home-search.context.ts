import { createContext } from 'react';
import { CurrentSearchParams } from '@utils';

export const HomeSearchContext = createContext<
  [CurrentSearchParams, React.Dispatch<CurrentSearchParams>]
>([{}, () => {}]);
