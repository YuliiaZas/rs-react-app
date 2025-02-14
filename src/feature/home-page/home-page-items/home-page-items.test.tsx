import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { act, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockItems, mockItemsIds } from '@mock';
import { PATH_VALUE, text } from '@utils';
import { HomePageItems } from './home-page-items';

const title = 'Test Title';
const locationSearch = '?search=test';
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
                items={mockItems}
                locationSearch={locationSearch}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(result.getByText(mockItems[0].name)).toBeInTheDocument();
      expect(result.getByText(mockItems[1].name)).toBeInTheDocument();
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
                items={mockItems}
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
    act(() => result.getByText(mockItems[0].name).click());
    expect(
      result.getByText(`${mockDetailsComponentText} ${mockItemsIds[0]}`)
    ).toBeInTheDocument();
  });
});
