import { createContext } from 'react';
import { CurrentSearchParams } from '@utils';

export const HomeSearchParamsContext = createContext<
  [CurrentSearchParams, React.Dispatch<CurrentSearchParams>]
>([{}, () => {}]);
