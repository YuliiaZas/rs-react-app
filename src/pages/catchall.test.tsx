import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import CatchAll, { loader } from './catchall';

describe('CatchAll', () => {
  it('should redirect to /404', async () => {
    const response = await loader();
    expect(response.headers.get('Location')).toBe('/404');
  });

  it('should render null', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/catchall']}>
        <Routes>
          <Route path="/catchall" element={<CatchAll />} />
        </Routes>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});
