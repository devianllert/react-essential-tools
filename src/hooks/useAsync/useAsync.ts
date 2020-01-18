import { useEffect, DependencyList } from 'react';
import { useAsyncFn, AsyncFn, AsyncState } from '../useAsyncFn';

/**
 * Hook that resolves an async function or a function that returns a promise
 */

export const useAsync = <T>(fn: (...args: any[]) => Promise<T>, deps: DependencyList = []): AsyncFn<T> => {  // eslint-disable-line
  const [state, start] = useAsyncFn<T>(fn, deps, {
    pending: true,
  });

  useEffect((): void => {
    start();
  }, [start]);

  return [state, start];
};

export {
  AsyncFn,
  AsyncState,
};
