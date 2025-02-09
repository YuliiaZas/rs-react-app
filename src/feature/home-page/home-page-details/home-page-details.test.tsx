import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  MemoryRouter,
  Route,
  Routes,
  useLoaderData,
  useOutletContext,
} from 'react-router-dom';
import { People } from '@utils';
import { HomePageDetails } from './home-page-details';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLoaderData: vi.fn(),
    useOutletContext: vi.fn(),
  };
});

describe('HomePageDetails', () => {
  const mockCloseFn = vi.fn();
  (useOutletContext as vi.Mock).mockReturnValue({ closeFn: mockCloseFn });

  it('should render formatted details when item is valid', () => {
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
    (useLoaderData as vi.Mock).mockReturnValue(mockItem);

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

  it('should call closeFn when close button is clicked', () => {
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
    (useLoaderData as vi.Mock).mockReturnValue(mockItem);

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
