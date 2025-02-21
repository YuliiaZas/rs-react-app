import { fireEvent, render } from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
  useOutletContext,
} from 'react-router-dom';
import { describe, expect, it, Mock, vi } from 'vitest';
import { text } from '@utils';
import { HomePageDetails } from './home-page-details';
import { mockItems, mockItemsFormatted } from '@mock';
import { useFetchItemQuery } from '../store/home-page-api.slice';
import { Provider } from 'react-redux';
import { store } from '@store';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useOutletContext: vi.fn(),
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
  const mockCloseFn = vi.fn();
  (useOutletContext as Mock).mockReturnValue({ closeFn: mockCloseFn });

  it('should render spinner while data loading', () => {
    fetchSpy.mockReturnValue({
      ...mockFetchResponce,
      isLoading: true,
    });

    const { getByRole } = render(
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<HomePageDetails />} />
          </Routes>
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
          <Routes>
            <Route path="/" element={<HomePageDetails />} />
          </Routes>
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
          <Routes>
            <Route path="/" element={<HomePageDetails />} />
          </Routes>
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
          <Routes>
            <Route path="/" element={<HomePageDetails />} />
          </Routes>
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
          <Routes>
            <Route path="/" element={<HomePageDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(getByLabelText('Close'));

    expect(mockCloseFn).toHaveBeenCalled();
  });
});
