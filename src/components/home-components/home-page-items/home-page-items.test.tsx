import { Provider } from 'react-redux';
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { useHomeSearch } from '@context';
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
import { CurrentSearchParams, text } from '@utils';
import { selectItem, unselectItem } from '@store';
import { HomePageItems } from './home-page-items';

vi.mock('@lib', () => ({
  CardSmall: ({ cardTitle }: { cardTitle: string }) => <div>{cardTitle}</div>,
  ErrorComponent: ({ errorMessageInfo }: { errorMessageInfo: string }) => (
    <div>{errorMessageInfo || text.errorComponent.errorMessage}</div>
  ),
  Pagination: ({
    pagesNumber,
    currentPage = '1',
    onClick,
  }: {
    pagesNumber: number | null;
    currentPage: string;
    onClick: () => void;
  }) => (
    <div onClick={onClick}>
      {currentPage} of {pagesNumber}
    </div>
  ),
}));

vi.mock('@store', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    dispatch: vi.fn(),
    getState: vi.fn(),
  };
});

vi.mock('@context', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useHomeSearch: vi.fn(),
  };
});

describe('HomePageItems', () => {
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
    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <HomePageItems itemsData={{ data: mockFetchItemsResult }} />
        </Provider>
      </MemoryRouter>
    );
    expect(
      getByText(`${text.homePage.resultTitleSearch} "${mockSearchValue}"`)
    ).toBeInTheDocument();
  });

  it('should render title for full list of items', async () => {
    paramsSpy.mockReturnValue([{ search: '' } as CurrentSearchParams]);
    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <HomePageItems itemsData={{ data: mockFetchItemsResult }} />
        </Provider>
      </MemoryRouter>
    );
    expect(getByText(text.homePage.resultTitleFull)).toBeInTheDocument();
  });

  it('should render error component on fetch error', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <HomePageItems itemsData={{ error: new Error('Error') }} />
        </Provider>
      </MemoryRouter>
    );
    expect(
      getByText(text.homePage.loadingErrorMessageInfo)
    ).toBeInTheDocument();
  });

  it('should render empty result message when no items', () => {
    const itemsData = {
      data: {
        ...mockFetchItemsResult,
        itemsFormatted: [],
      },
    };
    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <HomePageItems itemsData={itemsData} />
        </Provider>
      </MemoryRouter>
    );
    expect(getByText(text.homePage.emptyList)).toBeInTheDocument();
  });

  it('should render items with correct page buttons number', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <HomePageItems itemsData={{ data: mockFetchItemsResult }} />
        </Provider>
      </MemoryRouter>
    );
    expect(getByText(mockItems[0].name)).toBeInTheDocument();
    expect(getByText(mockItems[1].name)).toBeInTheDocument();
    expect(getByText('1 of 3')).toBeInTheDocument();
  });

  it('should render correct number of pagination buttons when it is the last page', async () => {
    paramsSpy.mockReturnValue([
      {
        search: mockSearchValue,
        page: mockPageNumber.toString(),
      },
    ]);
    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <HomePageItems itemsData={{ data: mockFetchItemsResultLastPage }} />
        </Provider>
      </MemoryRouter>
    );

    expect(getByText('3 of 3')).toBeInTheDocument();
  });

  it('should handle item selection', async () => {
    const { container } = render(
      <MemoryRouter>
        <Provider store={store}>
          <HomePageItems itemsData={{ data: mockFetchItemsResult }} />
        </Provider>
      </MemoryRouter>
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
});
