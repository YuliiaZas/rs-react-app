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
      transformResponse: (response: SearchResult<People>) => {
        return {
          ...response,
          itemsFormatted: response.results.map((item: People) =>
            getPeopleFormatted(item, false)
          ),
        };
      },
    }),
    fetchItem: builder.query<People | PeopleUnknown, string>({
      query: (id) => `/${id}`,
    }),
  }),
});

export const { useFetchItemsQuery, useFetchItemQuery } = apiSlice;
