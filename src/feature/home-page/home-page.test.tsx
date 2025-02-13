import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { HomePage } from './home-page';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { People, SearchResult, text } from '@utils';
import { CurrentSearchParams } from '@hooks';
import { peopleService } from '@services';
import { mockErrorComponentText, mockItems } from '@mock';

const fetchResult: SearchResult<People> = {
  results: mockItems,
  next: '2',
  previous: '',
  count: 5,
};

const fetchResultLastPage: SearchResult<People> = {
  ...fetchResult,
  next: '',
  count: 2,
};

const mockRouterDataInitial = {
  path: '/',
  location: { pathname: '/', search: '' },
  searchParams: {},
};

let mockRouterData = { ...mockRouterDataInitial };

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
  beforeEach(() => {
    mockRouterData = { ...mockRouterDataInitial };
  });

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

  it('should fetch data on search button click if search value have not been changed', async () => {
    vi.spyOn(peopleService, 'getItems');
    const { getByText } = await act(async () => render(<HomePage />));

    act(() => {
      fireEvent.click(getByText(text.search.button));
    });

    expect(peopleService.getItems).toHaveBeenCalled();
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

    expect(mockRouterData.searchParams).toStrictEqual({ page: pageButtonText });
  });

  it('should render correct number of pagination buttons when it the last page', async () => {
    vi.spyOn(peopleService, 'getItems').mockReturnValue(
      Promise.resolve(fetchResultLastPage)
    );

    const result = await act(async () => render(<HomePage />));
    const buttons =
      result.container.getElementsByClassName('pagination-button');

    expect(buttons.length).toBe(1);
  });

  it('should render error component on fetch error', async () => {
    vi.spyOn(peopleService, 'getItems').mockReturnValue(Promise.reject());
    const { getByText } = await act(async () => render(<HomePage />));

    expect(getByText(mockErrorComponentText)).toBeInTheDocument();
  });

  it('should render spinner while fetching data', async () => {
    const { getByRole } = render(<HomePage />);

    await waitFor(() => {
      expect(getByRole('status')).toBeInTheDocument();
    });
  });
});
