import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, Mock, vi } from 'vitest';
import ItemPage from './[id]';
import { peopleService } from '@services';

vi.mock('@services', () => ({
  peopleService: {
    getItem: vi.fn(),
  },
}));

vi.mock('@home-components', () => ({
  HomePageDetails: vi.fn(() => <div>HomePageDetails Component</div>),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useNavigation: () => ({
      location: { pathname: '/details/1' },
    }),
  };
});

describe('ItemPage', () => {
  it('should render the ItemPage component with data', async () => {
    const mockLoaderData = {
      data: { id: '1', name: 'John Doe' },
      searchParams: '',
    };
    (peopleService.getItem as Mock).mockResolvedValue(mockLoaderData.data);

    render(
      <MemoryRouter initialEntries={['/details/1']}>
        <Routes>
          <Route
            path="/details/:id"
            element={<ItemPage loaderData={mockLoaderData} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('HomePageDetails Component')).toBeInTheDocument();
  });

  it('should render the ItemPage component without data', async () => {
    const mockLoaderData = { data: null, searchParams: '' };
    (peopleService.getItem as Mock).mockResolvedValue(mockLoaderData.data);

    render(
      <MemoryRouter initialEntries={['/details/1']}>
        <Routes>
          <Route
            path="/details/:id"
            element={<ItemPage loaderData={mockLoaderData} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('HomePageDetails Component')).toBeInTheDocument();
  });
});
