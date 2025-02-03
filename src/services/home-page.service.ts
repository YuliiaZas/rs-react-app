import { People, SearchResult } from '@utils';

class PeopleService {
  baseUrl = 'api/people';

  async getItems(value?: string): Promise<SearchResult<People>> {
    const url = value ? `${this.baseUrl}?search=${value}` : this.baseUrl;
    const response = await fetch(url);
    return await response.json();
  }
}

export const peopleService = new PeopleService();
