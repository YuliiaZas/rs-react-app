import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { People, SearchResult } from '@utils';
import { CurrentSearchParams } from '@hooks';
import { peopleService } from './home-page.service';

describe('PeopleService', () => {
  const mockFetch = vi.fn();

  beforeAll(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  it('should fetch items with correct params', async () => {
    const paramsValue: CurrentSearchParams = { search: 'John' };
    const mockResponse: SearchResult<People> = {
      results: [],
      count: 0,
      next: '',
      previous: '',
    };
    mockFetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await peopleService.getItems(paramsValue);

    expect(mockFetch).toHaveBeenCalledWith('/api/people?search=John');
    expect(result).toEqual(mockResponse);
  });

  it('should fetch a single item with correct value', async () => {
    const value = '1';
    const mockResponse: People = {
      url: '1',
      name: 'John Doe',
      gender: '',
      birth_year: '',
      height: '',
      mass: '',
      eye_color: '',
      hair_color: '',
      skin_color: '',
    };
    mockFetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await peopleService.getItem(value);

    expect(mockFetch).toHaveBeenCalledWith('/api/people/1');
    expect(result).toEqual(mockResponse);
  });

  it('should return PeopleUnknown if no value is provided', async () => {
    const result = await peopleService.getItem();

    expect(result).toEqual({ detail: 'Not found' });
  });
});
