import {
  CurrentSearchParams,
  FetchResponce,
  getPeopleFormatted,
  isStringifiedNumberValid,
  People,
  PeopleFormatted,
  PeopleUnknown,
  SearchResult,
  SearchResultFormatted,
} from '@utils';

class PeopleService {
  // baseUrl = '/api/people';
  baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/people`;

  async getItems(
    paramsValue: CurrentSearchParams
  ): Promise<FetchResponce<SearchResultFormatted>> {
    const params = new URLSearchParams(paramsValue);
    try {
      const url = `${this.baseUrl}?${params}`;
      console.log(params, url);
      const response = await fetch(`${this.baseUrl}?${params}`);
      const searchResult: SearchResult = await response.json();
      return {
        data: {
          ...searchResult,
          itemsFormatted: searchResult.results.map((item: People) =>
            getPeopleFormatted(item, false)
          ),
        },
      };
    } catch (error) {
      console.log('Error occurs while fetching items: ', error);
      return { error: error as Error };
    }
  }

  async getItem(
    id?: string | string[]
  ): Promise<FetchResponce<PeopleFormatted | null>> {
    if (!isStringifiedNumberValid(id))
      return { error: new Error('Id is not valid') };

    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const loadedItem: People | PeopleUnknown = await response.json();
      return {
        data: !(loadedItem && 'url' in loadedItem)
          ? null
          : getPeopleFormatted(loadedItem, true),
      };
    } catch (error) {
      console.log('Error occurs while fetching item: ', error);
      return { error: error as Error };
    }
  }
}

export const peopleService = new PeopleService();
