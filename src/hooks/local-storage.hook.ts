import { useEffect, useState } from 'react';

export type UseLocalStorageArgs<T> = {
  key?: string;
  defaultValue: T;
};

export function useLocalStorage<T>({
  key = 'searchItem',
  defaultValue,
}: UseLocalStorageArgs<T>): [T, React.Dispatch<T>] {
  const [value, setValue] = useState<T>(() => getValueFromLocalStorage());

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  function getValueFromLocalStorage(): T {
    try {
      return JSON.parse(window.localStorage.getItem(key) ?? '');
    } catch (_e) {
      if (_e) window.localStorage.removeItem(key);
      return defaultValue;
    }
  }

  return [value, setValue];
}
