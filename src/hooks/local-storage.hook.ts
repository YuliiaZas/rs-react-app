import { useEffect, useState } from 'react';

export type UseLocalStorageArgs<T> = {
  key: string;
  defaultValue: T;
};

export function useLocalStorage<T>({
  key,
  defaultValue,
}: UseLocalStorageArgs<T>): [T, React.Dispatch<T>] {
  const [value, setValue] = useState<T>(() => getValueFromLocalStorage());

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (_e) {
      console.error('useLocalStorage.setItem', _e);
    }
  }, [key, value]);

  function getValueFromLocalStorage() {
    try {
      const value = window.localStorage.getItem(key);
      if (!value) {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
      }
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.log('Error while getValueFromLocalStorage()', e);
      window.localStorage.removeItem(key);
      return defaultValue;
    }
  }

  return [value, setValue];
}
