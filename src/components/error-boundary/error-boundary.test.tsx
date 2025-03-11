import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundaryPage } from './error-boundary';
import { ErrorComponent } from '@lib';

vi.mock('@lib', () => ({
  ErrorComponent: vi.fn(() => <div>ErrorComponent</div>),
}));

const mockNavigate = vi.fn();

vi.mock('react-router', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ErrorBoundaryPage', () => {
  it('should render ErrorComponent with generic error', () => {
    const error = new Error('Something went wrong');

    render(
      <MemoryRouter>
        <ErrorBoundaryPage error={error} />
      </MemoryRouter>
    );

    expect(screen.getByText('ErrorComponent')).toBeInTheDocument();
    expect(ErrorComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        showButton: true,
      }),
      {}
    );
  });
});
