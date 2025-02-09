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

  // it('should render list of items', () => {
  //   const items: People[] = [
  //     {
  //       name: 'Luke Skywalker',
  //       height: '172',
  //       mass: '77',
  //       hair_color: 'blond',
  //       skin_color: 'fair',
  //       eye_color: 'blue',
  //       birth_year: '19BBY',
  //       gender: 'male',
  //       url: 'https://swapi.dev/api/people/1/',
  //     },
  //     {
  //       name: 'Darth Vader',
  //       height: '202',
  //       mass: '136',
  //       hair_color: 'none',
  //       skin_color: 'white',
  //       eye_color: 'yellow',
  //       birth_year: '41.9BBY',
  //       gender: 'male',
  //       url: 'https://swapi.dev/api/people/4/',
  //     },
  //   ];

  //   const { getByText } = render(
  //     <MemoryRouter initialEntries={['/']}>
  //       <Routes>
  //         <Route
  //           path="/"
  //           element={
  //             <HomePageItems
  //               title={title}
  //               items={items}
  //               locationSearch={locationSearch}
  //             />
  //           }
  //         />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   expect(getByText('Luke Skywalker')).toBeInTheDocument();
  //   expect(getByText('Darth Vader')).toBeInTheDocument();
  // });
});
