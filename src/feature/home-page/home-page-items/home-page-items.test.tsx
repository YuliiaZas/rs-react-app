import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HomePageItems } from './home-page-items';

describe('HomePageItems', () => {
  const title = 'Test Title';
  const locationSearch = '?search=test';

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
});
