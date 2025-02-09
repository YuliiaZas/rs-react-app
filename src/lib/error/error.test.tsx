import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorComponent } from './error';
import { MemoryRouter } from 'react-router-dom';

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
    expect(getByText('Ooops! Something went wrong...')).toBeInTheDocument();
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
    expect(getByText('Home Page')).toBeInTheDocument();
  });

  it('should call buttonClick function if provided', () => {
    const buttonClick = vi.fn();
    const { getByText } = render(
      <MemoryRouter>
        <ErrorComponent showButton buttonClick={buttonClick} />
      </MemoryRouter>
    );
    fireEvent.click(getByText('Home Page'));
    expect(buttonClick).toHaveBeenCalled();
  });

  it('should navigate to home page if buttonClick is not provided', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ErrorComponent showButton />
      </MemoryRouter>
    );
    fireEvent.click(getByText('Home Page'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
