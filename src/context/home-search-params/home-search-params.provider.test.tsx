import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { HomeSearchParamsProvider } from './home-search-params.provider';
import { HomeSearchParamsContext } from './home-search-params.context';
import { useCurrentSearchParams } from './current-search-params.hook';
import { mockSearchValue } from '@mock';

vi.mock('./current-search-params.hook', () => ({
  useCurrentSearchParams: vi.fn(),
}));

vi.mock('./home-search-params.module.css', () => ({
  default: {
    wrapper: 'home-search-params-wrapper',
  },
}));

describe('HomeSearchParamsProvider', () => {
  const mockSearchParams = { search: mockSearchValue };
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    (useCurrentSearchParams as Mock).mockReturnValue([
      mockSearchParams,
      mockSetSearchParams,
    ]);
  });

  it('should provide search params and setSearchParams function', () => {
    render(
      <HomeSearchParamsProvider>
        <HomeSearchParamsContext.Consumer>
          {([searchParams, setSearchParams]) => (
            <>
              <div>{searchParams.search}</div>
              <button onClick={() => setSearchParams({ search: 'new' })}>
                Set Search Params
              </button>
            </>
          )}
        </HomeSearchParamsContext.Consumer>
      </HomeSearchParamsProvider>
    );

    expect(screen.getByText(mockSearchValue)).toBeInTheDocument();

    screen.getByText('Set Search Params').click();
    expect(mockSetSearchParams).toHaveBeenCalledWith({ search: 'new' });
  });

  it('should render children', () => {
    const ChildComponent = () => <div>Child Component</div>;

    render(
      <HomeSearchParamsProvider>
        <ChildComponent />
      </HomeSearchParamsProvider>
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });
});
