import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { text } from '@utils';
import { ErrorComponent } from './error';

const mockNavigate = vi.fn();

vi.mock('react-router', () => ({
  ...vi.importActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('ErrorComponent', () => {
  it('should render default error message', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ErrorComponent />
      </MemoryRouter>
    );
    expect(getByText(text.errorComponent.errorMessage)).toBeInTheDocument();
  });

  it('should render custom error message', () => {
    const errorMessage = 'Custom error message';
    const { getByText } = render(
      <MemoryRouter>
        <ErrorComponent errorMessage={errorMessage} />
      </MemoryRouter>
    );
    expect(getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render error message info if provided', () => {
    const errorMessageInfo = 'Additional error info';
    const { getByText } = render(
      <MemoryRouter>
        <ErrorComponent errorMessageInfo={errorMessageInfo} />
      </MemoryRouter>
    );
    expect(getByText(errorMessageInfo)).toBeInTheDocument();
  });

  it('should render button if showButton is true', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ErrorComponent showButton />
      </MemoryRouter>
    );
    expect(getByText(text.errorComponent.button)).toBeInTheDocument();
  });

  it('should call buttonClick function if provided', () => {
    const buttonClick = vi.fn();
    const { getByText } = render(
      <MemoryRouter>
        <ErrorComponent showButton buttonClick={buttonClick} />
      </MemoryRouter>
    );
    fireEvent.click(getByText(text.errorComponent.button));
    expect(buttonClick).toHaveBeenCalled();
  });

  it('should navigate to home page if buttonClick is not provided', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ErrorComponent showButton />
      </MemoryRouter>
    );
    fireEvent.click(getByText(text.errorComponent.button));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
