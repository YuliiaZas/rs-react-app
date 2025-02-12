import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { act, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PATH_VALUE, People, text } from '@utils';
import { HomePageItems } from './home-page-items';

const title = 'Test Title';
const locationSearch = '?search=test';
const itemsIds = ['1', '2'];
const items: People[] = [
  {
    name: 'Luke Skywalker',
    height: '172',
    mass: '77',
    hair_color: 'blond',
    skin_color: 'fair',
    eye_color: 'blue',
    birth_year: '19BBY',
    url: `url/${itemsIds[0]}`,
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
    url: `url/${itemsIds[1]}`,
    gender: 'n/a',
  },
];
const mockDetailsComponentText = 'Details Page for';

const MockDetailsComponent = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      {mockDetailsComponentText} {id}
    </div>
  );
};

describe('HomePageItems', () => {
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
    expect(getByText(text.homePage.emptyList)).toBeInTheDocument();
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
      expect(result.getByText(items[0].name)).toBeInTheDocument();
      expect(result.getByText(items[1].name)).toBeInTheDocument();
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
            element={<MockDetailsComponent />}
          />
        </Routes>
      </MemoryRouter>
    );
    act(() => result.getByText(items[0].name).click());
    expect(
      result.getByText(`${mockDetailsComponentText} ${itemsIds[0]}`)
    ).toBeInTheDocument();
  });
});
