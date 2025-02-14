import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { People, peopleUnknown, SearchResult } from '@utils';
import { CurrentSearchParams } from '@hooks';
import { peopleService } from './home-page.service';
import { mockItems } from '@mock';

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
      results: mockItems,
      count: mockItems.length,
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
    mockFetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockItems[0]),
    });

    const result = await peopleService.getItem(value);

    expect(mockFetch).toHaveBeenCalledWith(`/api/people/${value}`);
    expect(result).toEqual(mockItems[0]);
  });

  it('should return PeopleUnknown if no value is provided', async () => {
    const result = await peopleService.getItem();

    expect(result).toEqual(peopleUnknown);
  });
});
