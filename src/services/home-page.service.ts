import { CurrentSearchParams } from '@hooks';
import { People, PeopleUnknown, SearchResult } from '@utils';

class PeopleService {
  baseUrl = '/api/people';

  async getItems(
    paramsValue: CurrentSearchParams
  ): Promise<SearchResult<People>> {
    const params = new URLSearchParams(paramsValue);
    const response = await fetch(`${this.baseUrl}?${params}`);
    return await response.json();
  }

  async getItem(value?: string): Promise<People | PeopleUnknown> {
    if (!value) return { detail: 'Not found' };
    const response = await fetch(`${this.baseUrl}/${value}`);
    return await response.json();
  }
}

export const peopleService = new PeopleService();
