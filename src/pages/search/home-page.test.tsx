import { act, fireEvent, render } from '@testing-library/react';
import { HomePage } from './home-page';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CurrentSearchParams } from '@utils';
import { mockSearchValue } from '@mock';
import { Provider } from 'react-redux';
import { RootState, store } from '@store';

const mockRouterDataInitial = {
  path: '/',
  location: { pathname: '/', search: '' },
  searchParams: {},
};

let mockRouterData = { ...mockRouterDataInitial };

const mockCurrentPageParam = '1';
let mockParams: CurrentSearchParams = {
  search: mockSearchValue,
  page: mockCurrentPageParam,
};

const mockHomePageItemsComponentText = 'Mocked Home Page Items';
const mockHomePageDetailsComponentText = 'Mocked Home Page Details';

vi.mock('./home-page-items/home-page-items', () => ({
  HomePageItems: ({ title }: { title: string }) => (
    <div>
      {title}. {mockHomePageItemsComponentText}
    </div>
  ),
}));

vi.mock('@context', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useHomeSearch: () => [
      { search: mockSearchValue } as CurrentSearchParams,
      (value: CurrentSearchParams) => {
        mockParams = value;
      },
    ],
  };
});

vi.mock('@store', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    dispatch: vi.fn(),
    getState: vi.fn(),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: () => (path: string) => (mockRouterData.path = path),
    useLocation: () => mockRouterData.location,
    Outlet: () => <div>{mockHomePageDetailsComponentText}</div>,
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    mockRouterData = { ...mockRouterDataInitial };
  });

  it('should render Outlet', () => {
    const { getByText } = render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    expect(getByText(mockHomePageDetailsComponentText)).toBeInTheDocument();
  });

  it('should render spinner while fetching data', () => {
    const { getByRole } = render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    expect(getByRole('status')).toBeInTheDocument();
  });

  it('should update page param on page button click', async () => {
    vi.spyOn(store, 'getState').mockReturnValue({
      homePage: {
        isItemsLoading: false,
        isSearchSyncronized: false,
        pagesNumber: 3,
        selectedItems: {},
      },
    } as RootState);
    const pageButtonText = '2';
    const result = await act(async () =>
      render(
        <Provider store={store}>
          <HomePage />
        </Provider>
      )
    );
    expect(mockParams.page).toStrictEqual(mockCurrentPageParam);
    act(() => {
      fireEvent.click(result.getByText(pageButtonText));
    });
    expect(mockParams.page).toStrictEqual(pageButtonText);
  });
});
