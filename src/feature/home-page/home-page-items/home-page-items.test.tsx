import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PATH_VALUE, People } from '@utils';
import { HomePageItems } from './home-page-items';
import { act } from 'react';

const DetailsComponent = () => {
  const { id } = useParams<{ id: string }>();
  return <div>Details Page for {id}</div>;
};

describe('HomePageItems', () => {
  const title = 'Test Title';
  const locationSearch = '?search=test';

  const items: People[] = [
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
  ];

  it('should render title', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePageItems
                title={title}
                items={[]}
                locationSearch={locationSearch}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(getByText(title)).toBeInTheDocument();
  });

  it('should render empty result message when no items', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePageItems
                title={title}
                items={[]}
                locationSearch={locationSearch}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(
      getByText("Sorry, we couldn't find anything. Please check your request.")
    ).toBeInTheDocument();
  });

  it('should render items', async () => {
    const result = render(
      <MemoryRouter initialEntries={[PATH_VALUE.HOME]}>
        <Routes>
          <Route
            path={PATH_VALUE.HOME}
            element={
              <HomePageItems
                title={title}
                items={items}
                locationSearch={locationSearch}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(result.getByText('Luke Skywalker')).toBeInTheDocument();
      expect(result.getByText('C-3PO')).toBeInTheDocument();
    });
  });

  it('should navigate to details page', async () => {
    const result = render(
      <MemoryRouter initialEntries={[PATH_VALUE.HOME]}>
        <Routes>
          <Route
            path={PATH_VALUE.HOME}
            element={
              <HomePageItems
                title={title}
                items={items}
                locationSearch={locationSearch}
              />
            }
          />
          <Route
            path={`${PATH_VALUE.HOME}/:id`}
            element={<DetailsComponent />}
          />
        </Routes>
      </MemoryRouter>
    );
    act(() => result.getByText('Luke Skywalker').click());
    expect(result.getByText('Details Page for 1')).toBeInTheDocument();
  });
});
