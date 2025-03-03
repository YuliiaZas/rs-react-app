import { describe, expect, it, vi } from 'vitest';
import { peopleService } from '@services';
import { detailsLoader } from './details.loader';

vi.mock('@services/home-page.service.ts', () => ({
  peopleService: {
    getItem: () => vi.fn(),
  },
}));

describe('DetailsLoader', () => {
  it('should fetch data according to searchId from params', () => {
    vi.spyOn(peopleService, 'getItem');
    const params = { searchId: '1' };

    detailsLoader({
      request: new Request('http://test.com'),
      params,
    });
    expect(peopleService.getItem).toHaveBeenCalledWith(params.searchId);
  });
});
