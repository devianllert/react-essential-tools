import { useRef, useCallback, useEffect } from 'react';

interface UseDebouncedCallbackOptions {
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}

export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: UseDebouncedCallbackOptions = {},
): [T, () => void, () => void] => {
  const {
    maxWait,
    leading,
    trailing = true,
  } = options;

  const maxWaitHandler = useRef<number>();
  const maxWaitArgs: { current: any[] } = useRef([]);

  const leadingCall = useRef(false);

  const functionTimeoutHandler = useRef<number>();
  const isComponentUnmounted: { current: boolean } = useRef(false);

  const debouncedFunction = useRef(callback);
  debouncedFunction.current = callback;

  const cancelDebouncedCallback: () => void = useCallback(() => {
    clearTimeout(functionTimeoutHandler.current);
    clearTimeout(maxWaitHandler.current);

    maxWaitHandler.current = undefined;
    maxWaitArgs.current = [];

    functionTimeoutHandler.current = undefined;
    leadingCall.current = false;
  }, []);

  useEffect(
    () => (): void => {
      // we use flag, as we allow to call callPending outside the hook
      isComponentUnmounted.current = true;
    },
    [],
  );

  const debouncedCallback = useCallback(
    (...args) => {
      maxWaitArgs.current = args;

      clearTimeout(functionTimeoutHandler.current);

      if (leadingCall.current) {
        leadingCall.current = false;
      }

      if (!functionTimeoutHandler.current && leading && !leadingCall.current) {
        debouncedFunction.current(...args);
        leadingCall.current = true;
      }

      functionTimeoutHandler.current = setTimeout(() => {
        let shouldCallFunction = true;

        if (leading && leadingCall.current) {
          shouldCallFunction = false;
        }

        cancelDebouncedCallback();

        if (!isComponentUnmounted.current && trailing && shouldCallFunction) {
          debouncedFunction.current(...args);
        }
      }, delay);

      if (maxWait && !maxWaitHandler.current && trailing) {
        maxWaitHandler.current = setTimeout(() => {
          const waitArgs = maxWaitArgs.current;
          cancelDebouncedCallback();

          if (!isComponentUnmounted.current) {
            debouncedFunction.current.apply(null, waitArgs);
          }
        }, maxWait);
      }
    },
    [maxWait, delay, cancelDebouncedCallback, leading, trailing],
  );

  const callPending = (): void => {
    // Call pending callback only if we have anything in our queue
    if (!functionTimeoutHandler.current) {
      return;
    }

    debouncedFunction.current.apply(null, maxWaitArgs.current);
    cancelDebouncedCallback();
  };

  return [debouncedCallback as T, cancelDebouncedCallback, callPending];
};
