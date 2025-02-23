import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CurrentSearchParams,
  getPeopleFormatted,
  People,
  PeopleFormatted,
  PeopleUnknown,
  SearchResult,
  SearchResultFormatted,
} from '@utils';

export const apiSlice = createApi({
  reducerPath: '/api/homePage',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/people' }),
  endpoints: (builder) => ({
    fetchItems: builder.query<SearchResultFormatted, CurrentSearchParams>({
      query: (paramsValue) => `?${new URLSearchParams(paramsValue)}`,
      transformResponse: (searchResult: SearchResult) => {
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
