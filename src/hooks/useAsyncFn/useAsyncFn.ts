import { useCallback, DependencyList } from 'react';

import { useMountedState } from '../useMountedState';
import { useSetState } from '../useSetState';

export interface AsyncState<T> {
  pending: boolean;
  error?: Error;
  result?: T;
}

export type AsyncFn<T> = [
  AsyncState<T>,
  (...args: any[]) => Promise<T | Error> // eslint-disable-line
];

/**
 * Hook that returns state and a callback for an async function or a function that returns a promise.
 *
 * @param fn - async function or a function that returns a promise
 * @param deps - hook dependencies
 * @param initialState
 */

export const useAsyncFn = <T>(
  fn: (...args: any[]) => Promise<T>, // eslint-disable-line
  deps: DependencyList = [],
  initialState: AsyncState<T> = { pending: false },
): AsyncFn<T> => {
  const [state, setState] = useSetState<AsyncState<T>>({
    pending: false,
    error: undefined,
    result: undefined,
    ...initialState,
  });

  const isMounted = useMountedState();

  const callback = useCallback(async (...args: any[]): Promise<T | Error> => { // eslint-disable-line
    setState({ error: undefined, pending: true });

    try {
      const result = await fn(...args);

      if (isMounted()) setState({ result, error: undefined, pending: false });

      return result;
    } catch (error) {
      if (isMounted()) setState({ error, pending: false });

      return error;
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return [state, callback];
};
