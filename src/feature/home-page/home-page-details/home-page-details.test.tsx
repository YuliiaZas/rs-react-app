import { fireEvent, render } from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
  useLoaderData,
  useOutletContext,
} from 'react-router-dom';
import { describe, expect, it, Mock, vi } from 'vitest';
import { People, PeopleUnknown } from '@utils';
import { HomePageDetails } from './home-page-details';

vi.mock('@lib', () => ({
  ErrorComponent: vi.fn(() => <div>Error Component</div>),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLoaderData: vi.fn(),
    useOutletContext: vi.fn(),
  };
});

const mockItem: People = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.dev/api/people/1/',
};

describe('HomePageDetails', () => {
  const mockCloseFn = vi.fn();
  (useOutletContext as Mock).mockReturnValue({ closeFn: mockCloseFn });

  it('should render formatted details when item is valid', () => {
    (useLoaderData as Mock).mockReturnValue(mockItem);

    const { getByText } = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<HomePageDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Luke Skywalker')).toBeInTheDocument();
    expect(
      getByText((_content, element) => element?.textContent === 'Height: 172')
    ).toBeInTheDocument();
    expect(
      getByText((_content, element) => element?.textContent === 'Mass: 77')
    ).toBeInTheDocument();
    expect(
      getByText(
        (_content, element) => element?.textContent === 'Eye color: blue'
      )
    ).toBeInTheDocument();
  });

  it('should render error component when item has type PeopleUnknown', () => {
    const mockUnknown: PeopleUnknown = {
      detail: 'n/a',
    };
    (useLoaderData as Mock).mockReturnValue(mockUnknown);

    const { getByText } = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<HomePageDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Error Component')).toBeInTheDocument();
  });

  it('should call closeFn when close button is clicked', () => {
    (useLoaderData as Mock).mockReturnValue(mockItem);

    const { getByText } = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<HomePageDetails />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(getByText('x'));

    expect(mockCloseFn).toHaveBeenCalled();
  });
});
