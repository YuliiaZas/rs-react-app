import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLocalStorage } from '../local-storage.hook';

describe('useLocalStorage', () => {
  const key = 'testKey';
  const defaultValue = 'defaultValue';

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with default value if localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string>({ key, defaultValue })
    );

    expect(result.current[0]).toBe(defaultValue);
  });

  it('should initialize with value from localStorage if it exists', () => {
    window.localStorage.setItem(key, JSON.stringify('storedValue'));

    const { result } = renderHook(() =>
      useLocalStorage<string>({ key, defaultValue })
    );

    expect(result.current[0]).toBe('storedValue');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string>({ key, defaultValue })
    );

    act(() => {
      result.current[1]('newValue');
    });

    expect(window.localStorage.getItem(key)).toBe(JSON.stringify('newValue'));
  });

  it('should handle errors when getting localStorage', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    window.localStorage.setItem(key, 'invalid JSON');

    const { result } = renderHook(() =>
      useLocalStorage<string>({ key, defaultValue })
    );

    expect(result.current[0]).toBe(defaultValue);
    expect(spy).toHaveBeenCalledWith(
      'Error while getValueFromLocalStorage()',
      expect.any(Error)
    );
    expect(window.localStorage.getItem(key)).toBe(
      JSON.stringify('defaultValue')
    );

    spy.mockRestore();
  });
});
