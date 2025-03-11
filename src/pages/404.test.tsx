import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ErrorPage from './404';
import { text } from '@utils';
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

describe('ErrorPage', () => {
  it('should render ErrorComponent with not found error message', () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(screen.getByText('ErrorComponent')).toBeInTheDocument();
    expect(ErrorComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        errorMessage: text.notFoundPage.errorMessage,
        errorMessageInfo: text.notFoundPage.errorMessageInfo,
        showButton: true,
      }),
      {}
    );
  });
});
