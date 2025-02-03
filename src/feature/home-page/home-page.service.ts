import { People } from '../../utils/people.interface';
import { SearchResult } from '../../utils/search-result.interface';

class HomePageService {
  baseUrl = 'https://swapi.dev/api/people';

  async getItems(value?: string): Promise<SearchResult<People>> {
    const url = value ? `${this.baseUrl}?search=${value}` : this.baseUrl;
    const response = await fetch(url);
    return await response.json();
  }
}

const homePageService = new HomePageService();

export default homePageService;
