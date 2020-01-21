import { useCallback, useEffect, useRef } from 'react';

export interface UseTimeoutFnState {
  isReady: () => boolean | null;
  clear: () => void;
  start: () => void;
}

/**
 * Calls given function after specified amount of milliseconds.
 *
 * - Not re-render component;
 * - Automatically clear timeout on unmount;
 * - Automatically clear timeout on delay change;
 * - Reset function call will cancel previous timeout;
 * - Timeout will NOT be clear on function change. It will be called within the timeout,
 * - You have to clear it on your own when needed.
 */

export const useTimeoutFn = (fn: Function, ms = 0): UseTimeoutFnState => {
  const ready = useRef<boolean | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const callback = useRef(fn);

  const isReady = useCallback(() => ready.current, []);

  const start = useCallback(() => {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => clear, [ms]);

  return { isReady, clear, start };
};
