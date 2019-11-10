/* eslint-disable no-console */
import { useState } from 'react';

/**
 * Sync state to local storage so that it persists through a page refresh.
 * Usage is similar to useState except we pass in a local storage key so
 * that we can default to that value on page load instead of the specified initial value.
 *
 * @param {String} key - key for local storage
 * @param {T} initialValue - initial value for local storage key
 */

export const useLocalStorage = <T>(key: string, initialValue?: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>((): T => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If user is in private mode or has storage restriction
      // localStorage can throw. JSON.parse and JSON.stringify
      console.log(error);

      return initialValue as T;
    }
  });

  const setValue = (value: T): void => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // If user is in private mode or has storage restriction
      // localStorage can throw. Also JSON.stringify can throw.

      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
