import { useEffect, useRef } from 'react';

/**
 * Hook that called callback every delay milliseconds.
 *
 * @param callback - A function that will be called every delay milliseconds.
 * @param delay - A number representing the delay in msecs. Set to null to "pause" the interval.
 */

export const useInterval = (callback: Function, delay: number | null = 200): void => {
  const savedCallback = useRef<Function>();

  useEffect((): void => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect((): (() => void) | undefined => {
    const tick = (): void => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    let id: number;

    if (delay !== null) {
      id = window.setInterval(tick, delay);
    }

    return (): void => clearInterval(id);
  }, [delay]);
};
