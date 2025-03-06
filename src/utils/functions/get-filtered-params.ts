import { ParsedUrlQuery } from 'querystring';
import { CurrentSearchParams, isStringifiedNumberValid } from '@utils';

export function getFilteredParams(
  query: ParsedUrlQuery | CurrentSearchParams
): CurrentSearchParams {
  return {
    ...(typeof query.search === 'string' && { search: query.search }),
    ...(typeof query.page === 'string' &&
      isStringifiedNumberValid(query.page) && { page: query.page }),
  };
}
