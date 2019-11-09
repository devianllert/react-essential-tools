import { useEffect, DependencyList } from 'react';
import { useAsyncFn, AsyncFn, AsyncState } from '../useAsyncFn';

/**
 * Hook that resolves an async function or a function that returns a promise
 *
 * @param fn - async function or a function that returns a promise
 * @param deps - hook dependencies
 */

export const useAsync = <T>(fn: (...args: any[]) => Promise<T>, deps: DependencyList = []): AsyncFn<T> => {  // eslint-disable-line
  const [state, callback] = useAsyncFn<T>(fn, deps, {
    pending: true,
  });

  useEffect((): void => {
    callback();
  }, [callback]);

  return [state, callback];
};

export {
  AsyncFn,
  AsyncState,
};
