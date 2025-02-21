import { PeopleFormatted } from './people-formatted.interface';
import { People } from './people.interface';

export interface SearchResult<T = People> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

export interface SearchResultFormatted<T = People, F = PeopleFormatted>
  extends SearchResult<T> {
  itemsFormatted: F[];
}
