import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { mockFetchItemsResult, mockItems, mockItemsFormattedFull } from '@mock';
import { CurrentSearchParams } from '@utils';
import { peopleService } from './home-page.service';

describe('PeopleService', () => {
  const mockFetch = vi.fn();
  const urlOriginal = peopleService.baseUrl;
  const testUrl = 'http://localhost:3000/api';

  beforeAll(() => {
    global.fetch = mockFetch;
    peopleService.baseUrl = testUrl;
  });

  afterEach(() => {
    mockFetch.mockClear();
  });

  afterAll(() => {
    peopleService.baseUrl = urlOriginal;
  });

  it('should fetch items with correct params', async () => {
    const paramsValue: CurrentSearchParams = { search: 'John' };
    mockFetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockFetchItemsResult),
    });

    const result = await peopleService.getItems(paramsValue);

    expect(mockFetch).toHaveBeenCalledWith(`${testUrl}?search=John`);
    expect(result).toEqual({ data: mockFetchItemsResult });
  });

  it('should fetch a single item with correct value', async () => {
    const value = '1';
    mockFetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockItems[0]),
    });

    const result = await peopleService.getItem(value);

    expect(mockFetch).toHaveBeenCalledWith(`${testUrl}/1`);
    expect(result).toEqual({ data: mockItemsFormattedFull[0] });
  });

  it('should return PeopleUnknown if no value is provided', async () => {
    const result = await peopleService.getItem();

    expect(result).toEqual({ error: new Error('Id is not valid') });
  });
});
