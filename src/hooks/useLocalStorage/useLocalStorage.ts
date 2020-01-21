import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';

/**
 * Sync state to local storage so that it persists through a page refresh.
 * Usage is similar to useState except we pass in a local storage key so
 * that we can default to that value on page load instead of the specified initial value.
 */

export const useLocalStorage = <T>(key: string, initialValue?: T): [T, Dispatch<SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>((): T => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If user is in private mode or has storage restriction
      // localStorage can throw. JSON.parse and JSON.stringify

      return initialValue as T;
    }
  });

  const setValue = useCallback((): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      // If user is in private mode or has storage restriction
      // localStorage can throw. Also JSON.stringify can throw.
    }
  }, [key, storedValue]);

  useEffect(() => setValue(), [storedValue, setValue]);

  return [storedValue, setStoredValue];
};
