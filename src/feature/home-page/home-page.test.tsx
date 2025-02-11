import { act, fireEvent, render } from '@testing-library/react';
import { HomePage } from './home-page';
import { describe, expect, it, vi } from 'vitest';
import { People, SearchResult } from '@utils';
import { CurrentSearchParams } from '@hooks';
import { peopleService } from '@services';

const fetchResult: SearchResult<People> = {
  results: [
    {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      url: 'url/1',
      gender: 'male',
    },
    {
      name: 'C-3PO',
      height: '167',
      mass: '75',
      hair_color: 'n/a',
      skin_color: 'gold',
      eye_color: 'yellow',
      birth_year: '112BBY',
      url: 'url/2',
      gender: 'n/a',
    },
  ],
  next: '2',
  previous: '',
  count: 5,
};

const mockRouterData = {
  path: '/',
  location: { pathname: '/', search: '' },
  searchParams: { search: '' },
};

vi.mock('@lib/error/error', () => ({
  ErrorComponent: vi.fn(() => <div>Error Component</div>),
}));

vi.mock('./home-page-items/home-page-items', () => ({
  HomePageItems: () => <div>Mocked HomePageItems</div>,
}));

vi.mock('@services/home-page.service.ts', () => ({
  peopleService: {
    getItems: () => Promise.resolve(fetchResult),
  },
}));

vi.mock('@hooks/current-search-params.hook.ts', () => ({
  useCurrentSearchParams: () => [
    mockRouterData.searchParams,
    (x: CurrentSearchParams) => (mockRouterData.searchParams = x),
  ],
}));

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => (path: string) => (mockRouterData.path = path),
    useLocation: () => mockRouterData.location,
    Outlet: () => <div>Home Page Details</div>,
  };
});

describe('HomePage', async () => {
  it('should render Outlet', async () => {
    const result = await act(async () => render(<HomePage />));
    const searchInput = result.getByText('Home Page Details');
    expect(searchInput).toBeInTheDocument();
  });

  it('should update search value', async () => {
    const result = await act(async () => render(<HomePage />));
    const searchInput = result.getByPlaceholderText(
      'Input Name from Star Wars'
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'Luke' } });
    });
    expect(searchInput.value).toBe('Luke');
    act(() => {
      fireEvent.click(result.getByText('Search'));
    });
    expect(mockRouterData.searchParams).toStrictEqual({ search: 'Luke' });
  });

  it('should render correct number of pagination buttons', async () => {
    const result = await act(async () => render(<HomePage />));
    const buttons =
      result.container.getElementsByClassName('pagination-button');
    expect(buttons.length).toBe(3);
  });

  it('should update page param on page button click', async () => {
    const result = await act(async () => render(<HomePage />));
    act(() => {
      fireEvent.click(result.getByText('2'));
    });
    expect(mockRouterData.searchParams).toStrictEqual({
      search: 'Luke',
      page: '2',
    });
  });

  it('should render error component on fetch error', async () => {
    vi.spyOn(peopleService, 'getItems').mockReturnValue(Promise.reject());
    const result = await act(async () => render(<HomePage />));
    expect(result.getByText('Error Component')).toBeInTheDocument();
  });
});
