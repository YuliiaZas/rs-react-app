import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import HomePageDrawer from './null';
import { PATH_VALUE } from '@utils';

vi.mock('@home-components', () => ({
  HomePageDetails: vi.fn(() => <div>HomePageDetails Component</div>),
}));

describe('HomePageDrawer', () => {
  it('should not render HomePageDetails component when not navigating to details', () => {
    vi.mock('react-router-dom', async (importOriginal) => {
      const actual = (await importOriginal()) as object;
      return {
        ...actual,
        useNavigation: () => ({
          location: { pathname: PATH_VALUE.HOME },
        }),
      };
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePageDrawer />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.queryByText('HomePageDetails Component')
    ).not.toBeInTheDocument();
  });
});
