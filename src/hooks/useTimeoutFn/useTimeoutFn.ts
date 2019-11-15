import { useCallback, useEffect, useRef } from 'react';

export type UseTimeoutFnReturn = {
  isReady: () => boolean | null;
  clear: () => void;
  set: () => void;
};

/**
 * Calls given function after specified amount of milliseconds.
 *
 * Not re-render component;
 * Automatically clear timeout on unmount;
 * Automatically clear timeout on delay change;
 * Reset function call will cancel previous timeout;
 * Timeout will NOT be clear on function change. It will be called within the timeout,
 * You have to clear it on your own when needed.
 *
 * @param fn - callback
 * @param ms - delay
 */

export const useTimeoutFn = (fn: Function, ms = 0): UseTimeoutFnReturn => {
  const ready = useRef<boolean | null>(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const callback = useRef(fn);

  const isReady = useCallback(() => ready.current, []);

  const set = useCallback(() => {
    ready.current = false;
    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      ready.current = true;
      callback.current();
    }, ms);
  }, [ms]);

  const clear = useCallback(() => {
    ready.current = null;

    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  useEffect(() => clear, [set, clear]);

  return { isReady, clear, set };
};
