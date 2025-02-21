import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, Mock, vi } from 'vitest';
import { mockItems, mockItemsFormatted } from '@mock';
import { store } from '@store';
import { text } from '@utils';
import { useFetchItemQuery } from '../store/home-page-api.slice';
import { HomePageDetails } from './home-page-details';

const mockCloseFn = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useOutletContext: () => ({ closeFn: mockCloseFn }),
  };
});

vi.mock('../store/home-page-api.slice', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useFetchItemQuery: vi.fn(),
  };
});

const mockItem = mockItemsFormatted[0];
const mockItemRaw = mockItems[0];

const mockFetchResponce = {
  data: mockItem,
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: vi.fn(),
};

describe('HomePageDetails', () => {
  const fetchSpy = useFetchItemQuery as Mock;

  it('should render spinner while data loading', () => {
    fetchSpy.mockReturnValue({
      ...mockFetchResponce,
      isLoading: true,
    });

    const { getByRole } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageDetails />
        </MemoryRouter>
      </Provider>
    );

    expect(getByRole('status')).toBeInTheDocument();
  });

  it('should render formatted details when item is valid', () => {
    fetchSpy.mockReturnValue(mockFetchResponce);

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageDetails />
        </MemoryRouter>
      </Provider>
    );

    expect(getByText(mockItem.name)).toBeInTheDocument();
    expect(
      getByText(
        (_content, element) =>
          element?.textContent === `Height: ${mockItemRaw.height}`
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        (_content, element) =>
          element?.textContent === `Mass: ${mockItemRaw.mass}`
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        (_content, element) =>
          element?.textContent === `Eye color: ${mockItemRaw.eye_color}`
      )
    ).toBeInTheDocument();
  });

  it('should render error component when item has type PeopleUnknown', () => {
    fetchSpy.mockReturnValue({
      ...mockFetchResponce,
      data: null,
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageDetails />
        </MemoryRouter>
      </Provider>
    );

    expect(getByText(text.homePage.emptyDetails)).toBeInTheDocument();
  });

  it('should render error component when data loading fails', () => {
    fetchSpy.mockReturnValue({
      ...mockFetchResponce,
      isError: true,
    });

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageDetails />
        </MemoryRouter>
      </Provider>
    );

    expect(getByText(text.errorComponent.errorMessage)).toBeInTheDocument();
  });

  it('should call closeFn when close button is clicked', () => {
    fetchSpy.mockReturnValue(mockFetchResponce);

    const { getByLabelText } = render(
      <Provider store={store}>
        <MemoryRouter>
          <HomePageDetails />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(getByLabelText('Close'));

    expect(mockCloseFn).toHaveBeenCalled();
  });
});
