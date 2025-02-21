import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import {
  mockFetchItemsResult,
  mockFetchItemsResultLastPage,
  mockItems,
  mockItemsFormatted,
  mockItemsIds,
  mockPageNumber,
  mockSearchValue,
} from '@mock';
import { store } from '@store';
import { CurrentSearchParams, PATH_VALUE, text } from '@utils';
import { useFetchItemsQuery } from '../store/home-page-api.slice';
import {
  selectItem,
  setPagesNumber,
  unselectItem,
} from '../store/home-page.slice';
import { HomePageItems } from './home-page-items';
import { useHomeSearch } from '@context';

const locationSearch = `?search=${mockSearchValue}`;
const mockDetailsComponentText = 'Details Page for';

const MockDetailsComponent = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      {mockDetailsComponentText} {id}
    </div>
  );
};

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useLocation: () => ({ search: locationSearch }),
    useSearchParams: () => [new URLSearchParams(locationSearch)],
  };
});

vi.mock('../store/home-page-api.slice', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useFetchItemsQuery: vi.fn(),
  };
});

vi.mock('@store', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    dispatch: vi.fn(),
  };
});

vi.mock('@context', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useHomeSearch: vi.fn(),
  };
});

const mockFetchResponce = {
  data: mockFetchItemsResult,
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: vi.fn(),
};

describe('HomePageItems', () => {
  const fetchSpy = useFetchItemsQuery as Mock;
  const paramsSpy = useHomeSearch as Mock;

  beforeEach(() => {
    vi.spyOn(store, 'dispatch');
    paramsSpy.mockReturnValue([
      { search: mockSearchValue } as CurrentSearchParams,
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render title', async () => {
    paramsSpy.mockReturnValue([{ search: mockSearchValue }]);
    fetchSpy.mockReturnValue(mockFetchResponce);
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageItems locationSearch={locationSearch} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      getByText(`${text.homePage.resultTitleSearch} "${mockSearchValue}"`)
    ).toBeInTheDocument();
  });

  it('should render title for full list of items', async () => {
    paramsSpy.mockReturnValue([{ search: '' } as CurrentSearchParams]);
    fetchSpy.mockReturnValue(mockFetchResponce);
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageItems locationSearch={locationSearch} />
        </MemoryRouter>
      </Provider>
    );
    expect(getByText(text.homePage.resultTitleFull)).toBeInTheDocument();
  });

  it('should not render title while loading', async () => {
    fetchSpy.mockReturnValue({
      ...mockFetchResponce,
      isLoading: true,
    });
    const { queryByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageItems locationSearch={locationSearch} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      queryByText(`${text.homePage.resultTitleSearch} "${mockSearchValue}"`)
    ).not.toBeInTheDocument();
  });

  it('should render error component on fetch error', async () => {
    fetchSpy.mockReturnValue({
      ...mockFetchResponce,
      isError: true,
    });
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageItems locationSearch={locationSearch} />
        </MemoryRouter>
      </Provider>
    );
    expect(
      getByText(text.homePage.loadingErrorMessageInfo)
    ).toBeInTheDocument();
    expect(store.dispatch).toHaveBeenCalledWith(setPagesNumber(mockPageNumber));
  });

  it('should render empty result message when no items', () => {
    fetchSpy.mockReturnValue({
      ...mockFetchResponce,
      data: {
        ...mockFetchResponce.data,
        itemsFormatted: [],
      },
    });
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageItems locationSearch={locationSearch} />
        </MemoryRouter>
      </Provider>
    );
    expect(getByText(text.homePage.emptyList)).toBeInTheDocument();
    expect(store.dispatch).toHaveBeenCalledWith(setPagesNumber(null));
  });

  it('should render items with correct page buttons number', async () => {
    fetchSpy.mockReturnValue(mockFetchResponce);
    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageItems locationSearch={locationSearch} />
        </MemoryRouter>
      </Provider>
    );
    expect(getByText(mockItems[0].name)).toBeInTheDocument();
    expect(getByText(mockItems[1].name)).toBeInTheDocument();
    expect(store.dispatch).toHaveBeenCalledWith(setPagesNumber(mockPageNumber));
  });

  it('should render correct number of pagination buttons when it is the last page', async () => {
    fetchSpy.mockReturnValue({
      ...mockFetchResponce,
      data: mockFetchItemsResultLastPage,
    });
    paramsSpy.mockReturnValue([
      {
        search: mockSearchValue,
        page: mockPageNumber.toString(),
      },
    ]);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageItems locationSearch={locationSearch} />
        </MemoryRouter>
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(setPagesNumber(mockPageNumber));
  });

  it('should handle item selection', async () => {
    fetchSpy.mockReturnValue(mockFetchResponce);
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageItems locationSearch={locationSearch} />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = container.querySelector(
      `input[type="checkbox"][id="${mockItemsIds[0]}"]`
    );
    const checkboxLabel: HTMLElement | null = container.querySelector(
      `label[for="${mockItemsIds[0]}"]`
    );

    act(() => {
      checkboxLabel?.click();
    });
    expect(checkbox).toBeChecked();

    expect(store.dispatch).toHaveBeenCalledWith(
      selectItem({ item: mockItemsFormatted[0], id: mockItemsIds[0] })
    );
    act(() => {
      checkboxLabel?.click();
    });
    expect(checkbox).not.toBeChecked();
    expect(store.dispatch).toHaveBeenCalledWith(
      unselectItem({ id: mockItemsIds[0] })
    );
  });

  it('should navigate to details page', async () => {
    fetchSpy.mockReturnValue(mockFetchResponce);
    const result = render(
      <MemoryRouter initialEntries={[PATH_VALUE.HOME]}>
        <Routes>
          <Route
            path={PATH_VALUE.HOME}
            element={
              <Provider store={store}>
                <HomePageItems locationSearch={locationSearch} />
              </Provider>
            }
          />
          <Route
            path={`${PATH_VALUE.HOME}/:id`}
            element={<MockDetailsComponent />}
          />
        </Routes>
      </MemoryRouter>
    );
    act(() => result.getByText(mockItems[0].name).click());
    expect(
      result.getByText(`${mockDetailsComponentText} ${mockItemsIds[0]}`)
    ).toBeInTheDocument();
  });
});
