import { useEffect, useRef } from 'react';

/**
 * Hook that stores a value and pass it back to the component on each render. Useful for
 * example to store a prop and compare it to the newest value.
 */

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect((): void => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
