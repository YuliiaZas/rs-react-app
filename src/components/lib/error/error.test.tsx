import { fireEvent, render } from '@testing-library/react';
import createMockRouter from 'next-router-mock';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { describe, expect, it, vi } from 'vitest';
import { text } from '@utils';
import { ErrorComponent } from './error';

const mockRouter = createMockRouter;
mockRouter.push = vi.fn();

describe('ErrorComponent', () => {
  it('should render default error message', () => {
    const { getByText } = render(
      <RouterContext.Provider value={mockRouter}>
        <ErrorComponent />
      </RouterContext.Provider>
    );
    expect(getByText(text.errorComponent.errorMessage)).toBeInTheDocument();
  });

  it('should render custom error message', () => {
    const errorMessage = 'Custom error message';
    const { getByText } = render(
      <RouterContext.Provider value={mockRouter}>
        <ErrorComponent errorMessage={errorMessage} />
      </RouterContext.Provider>
    );
    expect(getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render error message info if provided', () => {
    const errorMessageInfo = 'Additional error info';
    const { getByText } = render(
      <RouterContext.Provider value={mockRouter}>
        <ErrorComponent errorMessageInfo={errorMessageInfo} />
      </RouterContext.Provider>
    );
    expect(getByText(errorMessageInfo)).toBeInTheDocument();
  });

  it('should render button if showButton is true', () => {
    const { getByText } = render(
      <RouterContext.Provider value={mockRouter}>
        <ErrorComponent showButton />
      </RouterContext.Provider>
    );
    expect(getByText(text.errorComponent.button)).toBeInTheDocument();
  });

  it('should call buttonClick function if provided', () => {
    const buttonClick = vi.fn();
    const { getByText } = render(
      <RouterContext.Provider value={mockRouter}>
        <ErrorComponent showButton buttonClick={buttonClick} />
      </RouterContext.Provider>
    );
    fireEvent.click(getByText(text.errorComponent.button));
    expect(buttonClick).toHaveBeenCalled();
  });

  it('should navigate to home page if buttonClick is not provided', () => {
    const { getByText } = render(
      <RouterContext.Provider value={mockRouter}>
        <ErrorComponent showButton />
      </RouterContext.Provider>
    );
    fireEvent.click(getByText(text.errorComponent.button));
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
