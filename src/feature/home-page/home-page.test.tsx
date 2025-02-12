import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { HomePage } from './home-page';
import { describe, expect, it, vi } from 'vitest';
import { People, SearchResult, text } from '@utils';
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

let mockRouterData = {
  path: '/',
  location: { pathname: '/', search: '' },
  searchParams: { search: '' },
};

const mockErrorComponentText = 'Mocked Error Component';
const mockHomePageItemsComponentText = 'Mocked Home Page Items';
const mockHomePageDetailsComponentText = 'Mocked Home Page Details';

const searchValue = 'Luke';

vi.mock('@lib/error/error', () => ({
  ErrorComponent: vi.fn(() => <div>{mockErrorComponentText}</div>),
}));

vi.mock('./home-page-items/home-page-items', () => ({
  HomePageItems: ({ title }: { title: string }) => (
    <div>
      {title}. {mockHomePageItemsComponentText}
    </div>
  ),
}));

vi.mock('@services/home-page.service.ts', () => ({
  peopleService: {
    getItems: () => Promise.resolve(fetchResult),
  },
}));

vi.mock('@hooks/current-search-params.hook.ts', () => ({
  useCurrentSearchParams: () => [
    mockRouterData.searchParams,
    (x: CurrentSearchParams) =>
      (mockRouterData = { ...mockRouterData, searchParams: x }),
  ],
}));

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => (path: string) => (mockRouterData.path = path),
    useLocation: () => mockRouterData.location,
    Outlet: () => <div>{mockHomePageDetailsComponentText}</div>,
  };
});

describe('HomePage', async () => {
  it('should render default title for HomePageItems when search value is empty', async () => {
    const { getByText } = await act(async () => render(<HomePage />));

    expect(
      getByText(
        `${text.homePage.resultTitleFull}. ${mockHomePageItemsComponentText}`
      )
    ).toBeInTheDocument();
  });

  it('should render Outlet', async () => {
    const { getByText } = await act(async () => render(<HomePage />));

    expect(getByText(mockHomePageDetailsComponentText)).toBeInTheDocument();
  });

  it('should update search value', async () => {
    const { getByPlaceholderText, getByText, rerender } = await act(async () =>
      render(<HomePage />)
    );
    const searchInput = getByPlaceholderText(
      text.homePage.searchPlaceholder
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(searchInput, { target: { value: searchValue } });
    });

    expect(searchInput.value).toBe(searchValue);

    act(() => {
      fireEvent.click(getByText(text.search.button));
    });

    expect(mockRouterData.searchParams).toStrictEqual({ search: searchValue });
    rerender(<HomePage />);

    await waitFor(() => {
      expect(
        getByText(
          `${text.homePage.resultTitleSearch} "${searchValue}". ${mockHomePageItemsComponentText}`
        )
      ).toBeInTheDocument();
    });
  });

  it('should render correct number of pagination buttons', async () => {
    const result = await act(async () => render(<HomePage />));
    const buttons =
      result.container.getElementsByClassName('pagination-button');

    expect(buttons.length).toBe(3);
  });

  it('should update page param on page button click', async () => {
    const pageButtonText = '2';
    const result = await act(async () => render(<HomePage />));

    act(() => {
      fireEvent.click(result.getByText(pageButtonText));
    });

    expect(mockRouterData.searchParams).toStrictEqual({
      search: searchValue,
      page: pageButtonText,
    });
  });

  it('should render error component on fetch error', async () => {
    vi.spyOn(peopleService, 'getItems').mockReturnValue(Promise.reject());
    const { getByText } = await act(async () => render(<HomePage />));

    expect(getByText(mockErrorComponentText)).toBeInTheDocument();
  });

  it('should render spinner while fetching data', async () => {
    const result = render(<HomePage />);

    await waitFor(() => {
      expect(
        result.container.querySelector('.spinner-wrapper')
      ).toBeInTheDocument();
    });
  });
});
