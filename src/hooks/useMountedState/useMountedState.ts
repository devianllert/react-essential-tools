import { useEffect, useCallback, useRef } from 'react';

/**
 * Lifecycle hook providing ability to check component's mount state.
 * Gives a function that will return true if component mounted and false otherwise.
 */

export const useMountedState = (): (() => boolean) => {
  const mountedRef = useRef<boolean>(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect((): (() => void) => {
    mountedRef.current = true;

    return (): void => {
      mountedRef.current = false;
    };
  });

  return get;
};
