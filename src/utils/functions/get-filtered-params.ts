import { ParsedUrlQuery } from 'querystring';
import { CurrentSearchParams, isStringifiedNumberValid } from '@utils';

export function getFilteredParams(
  query: ParsedUrlQuery | CurrentSearchParams | URLSearchParams
): CurrentSearchParams {
  if (query instanceof URLSearchParams) {
    return {
      ...(query.get('search') && { search: query.get('search') as string }),
      ...(query.get('page') && {
        page: query.get('page') as string,
      }),
    };
  }

  return {
    ...(typeof query.search === 'string' && { search: query.search }),
    ...(typeof query.page === 'string' &&
      isStringifiedNumberValid(query.page) && { page: query.page }),
  };
}
