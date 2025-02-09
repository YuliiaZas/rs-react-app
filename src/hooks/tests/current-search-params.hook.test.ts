import { MemoryRouter, useSearchParams } from 'react-router';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCurrentSearchParams } from '../current-search-params.hook';

vi.mock('react-router', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe('useCurrentSearchParams', () => {
  const setSearchParamsMock = vi.fn();
  const useSearchParamsMock = useSearchParams as vi.Mock;

  beforeEach(() => {
    useSearchParamsMock.mockReturnValue([
      new URLSearchParams(),
      setSearchParamsMock,
    ]);
    window.localStorage.clear();
  });

  it('should initialize with default search params if query is empty', () => {
    const { result } = renderHook(() => useCurrentSearchParams(), {
      wrapper: MemoryRouter,
    });

    expect(result.current[0]).toEqual({ search: '' });
  });

  it('should update search params in localStorage when query changes', () => {
    const query = new URLSearchParams({ search: 'test', page: '1' });
    useSearchParamsMock.mockReturnValue([query, setSearchParamsMock]);

    const { result } = renderHook(() => useCurrentSearchParams(), {
      wrapper: MemoryRouter,
    });

    expect(result.current[0]).toEqual({ search: 'test', page: '1' });
  });

  it('should set new search params', () => {
    const { result } = renderHook(() => useCurrentSearchParams(), {
      wrapper: MemoryRouter,
    });

    act(() => {
      result.current[1]({ search: 'newSearch', page: '2' });
    });

    expect(setSearchParamsMock).toHaveBeenCalledWith({
      search: 'newSearch',
      page: '2',
    });
  });
});
