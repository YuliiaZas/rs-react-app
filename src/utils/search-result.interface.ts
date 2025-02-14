export interface SearchResult<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
