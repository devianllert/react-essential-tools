import { useRef, useCallback, DependencyList } from 'react';

import { useMountedState } from '../useMountedState';
import { useSetState } from '../useSetState';

export interface AsyncState<T> {
  pending: boolean;
  error?: Error;
  result?: T;
}

export type AsyncFn<T> = [
  AsyncState<T>,
  (...args: any[]) => Promise<T | Error>,
];

/**
 * Hook that returns state and a callback for an async function or a function that returns a promise.
 */

export const useAsyncFn = <T>(
  fn: (...args: any[]) => Promise<T>, // eslint-disable-line
  deps: DependencyList = [],
  initialState: AsyncState<T> = { pending: false },
): AsyncFn<T> => {
  const count = useRef(0);
  const [state, setState] = useSetState<AsyncState<T>>({
    pending: false,
    error: undefined,
    result: undefined,
    ...initialState,
  });

  const isMounted = useMountedState();

  const start = useCallback(async (...args: any[]): Promise<T | Error> => { // eslint-disable-line
    count.current += 1;
    const runCount = count.current;

    setState({ error: undefined, pending: true });

    try {
      const result = await fn(...args);

      if (isMounted() && runCount === count.current) setState({ result, error: undefined, pending: false });

      return result;
    } catch (error) {
      if (isMounted() && runCount === count.current) setState({ error, pending: false });

      return error;
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return [state, start];
};
