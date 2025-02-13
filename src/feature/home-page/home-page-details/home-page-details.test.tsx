import { act, fireEvent, render, waitFor } from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
  useLoaderData,
  useOutletContext,
} from 'react-router-dom';
import { describe, expect, it, Mock, vi } from 'vitest';
import { peopleUnknown, text } from '@utils';
import { HomePageDetails } from './home-page-details';
import { mockErrorComponentText, mockItems } from '@mock';

vi.mock(
  '@lib',
  async (importOriginal: () => Promise<Record<string, unknown>>) => {
    const actual = await importOriginal();
    return {
      ...actual,
      ErrorComponent: vi.fn(({ errorMessageInfo }) => (
        <div>
          {mockErrorComponentText} {errorMessageInfo}
        </div>
      )),
    };
  }
);

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useOutletContext: vi.fn(),
  };
});

const mockItem = mockItems[0];
const mockData = {
  item: Promise.resolve(mockItem),
};
const mockUnknownData = {
  item: Promise.resolve(peopleUnknown),
};

describe('HomePageDetails', () => {
  const mockCloseFn = vi.fn();
  (useOutletContext as Mock).mockReturnValue({ closeFn: mockCloseFn });

  it('should render spinner while data loading', async () => {
    (useLoaderData as Mock).mockReturnValue(mockData);

    const { getByRole } = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<HomePageDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByRole('status')).toBeInTheDocument();
    });
  });

  it('should render formatted details when item is valid', async () => {
    (useLoaderData as Mock).mockReturnValue(mockData);

    const { getByText } = await act(async () =>
      render(
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<HomePageDetails />} />
          </Routes>
        </MemoryRouter>
      )
    );

    expect(getByText(mockItem.name)).toBeInTheDocument();
    expect(
      getByText(
        (_content, element) =>
          element?.textContent === `Height: ${mockItem.height}`
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        (_content, element) => element?.textContent === `Mass: ${mockItem.mass}`
      )
    ).toBeInTheDocument();
    expect(
      getByText(
        (_content, element) =>
          element?.textContent === `Eye color: ${mockItem.eye_color}`
      )
    ).toBeInTheDocument();
  });

  it('should render error component when item has type PeopleUnknown', async () => {
    (useLoaderData as Mock).mockReturnValue(mockUnknownData);

    const { getByText } = await act(async () =>
      render(
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<HomePageDetails />} />
          </Routes>
        </MemoryRouter>
      )
    );

    expect(
      getByText(`${mockErrorComponentText} ${text.homePage.emptyDetails}`)
    ).toBeInTheDocument();
  });

  it('should render error component when data loading fails', async () => {
    (useLoaderData as Mock).mockReturnValue({ item: Promise.reject() });

    const { getByText } = await act(async () =>
      render(
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<HomePageDetails />} />
          </Routes>
        </MemoryRouter>
      )
    );

    expect(getByText(mockErrorComponentText)).toBeInTheDocument();
  });

  it('should call closeFn when close button is clicked', async () => {
    (useLoaderData as Mock).mockReturnValue(mockData);

    const { getByText } = await act(async () =>
      render(
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<HomePageDetails />} />
          </Routes>
        </MemoryRouter>
      )
    );

    fireEvent.click(getByText('x'));

    expect(mockCloseFn).toHaveBeenCalled();
  });
});
