import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CurrentSearchParams,
  getPeopleFormatted,
  People,
  PeopleFormatted,
  PeopleUnknown,
  SearchResult,
} from '@utils';

export const apiSlice = createApi({
  reducerPath: '/api/people',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/people' }),
  endpoints: (builder) => ({
    fetchItems: builder.query<
      SearchResult<People> & { itemsFormatted: PeopleFormatted[] },
      CurrentSearchParams
    >({
      query: (paramsValue) => `?${new URLSearchParams(paramsValue)}`,
      transformResponse: (searchResult: SearchResult<People>) => {
        return {
          ...searchResult,
          itemsFormatted: searchResult.results.map((item: People) =>
            getPeopleFormatted(item, false)
          ),
        };
      },
    }),
    fetchItem: builder.query<PeopleFormatted | null, string>({
      query: (id) => `/${id}`,
      transformResponse: (loadedItem: People | PeopleUnknown) => {
        return !(loadedItem && 'url' in loadedItem)
          ? null
          : getPeopleFormatted(loadedItem, true);
      },
    }),
  }),
});

export const { useFetchItemsQuery, useFetchItemQuery } = apiSlice;
