import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Home, { loader } from './home';
import { PATH_VALUE } from '@utils';

describe('Home', () => {
  it('should redirect to home page', async () => {
    const response = await loader();
    expect(response.headers.get('Location')).toBe(PATH_VALUE.HOME);
  });

  it('should render null', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          <Route path="/home" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});
