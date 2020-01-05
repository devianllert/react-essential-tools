import { useMemo } from 'react';

import { useEvent } from '../useEvent';

export type UseKeyHandler = (event: KeyboardEvent) => void;

export type UseKeyFilter = null | undefined | string | ((event: KeyboardEvent) => boolean);

export type UseKeyPredicate = (event: KeyboardEvent) => boolean;

export interface UseKeyOptions {
  event?: 'keydown' | 'keypress' | 'keyup';
  target?: EventTarget;
  options?: AddEventListenerOptions;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const createKeyPredicate = (keyFilter: UseKeyFilter): UseKeyPredicate => {
  if (typeof keyFilter === 'function') return keyFilter;

  if (typeof keyFilter === 'string') return (event: KeyboardEvent): boolean => event.key === keyFilter;

  return keyFilter
    ? (): boolean => true
    : (): boolean => false;
};

/**
 * Hook that executes a handler when a keyboard key is used.
 */

export const useKey = (key: UseKeyFilter, fn: UseKeyHandler = noop, opts: UseKeyOptions = {}): void => {
  const { event = 'keydown', target, options } = opts;

  const useMemoHandler = useMemo((): UseKeyHandler => {
    const predicate: UseKeyPredicate = createKeyPredicate(key);

    const handler: UseKeyHandler = (handlerEvent): void => {
      if (!predicate(handlerEvent)) return;

      fn(handlerEvent);
    };

    return handler;
  }, [key, fn]);

  useEvent(event, useMemoHandler, target, options);
};
