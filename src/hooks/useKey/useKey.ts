import { useMemo, useCallback } from 'react';

import { useEvent } from '../useEvent';

export type UseKeyHandler = (event: KeyboardEvent) => void;

export type UseKeyPredicate = (event: KeyboardEvent) => boolean;

export interface UseKeyOptions {
  event?: 'keydown' | 'keypress' | 'keyup';
  target?: EventTarget;
  options?: AddEventListenerOptions;
}

const matchKeyboardEvent = (
  e: KeyboardEvent,
  identifier: string | number,
): boolean => {
  if (
    e.key === identifier
    || e.code === identifier
    || e.keyCode === identifier
    || e.which === identifier
    || e.charCode === identifier
  ) return true;

  return false;
};

/**
 * Hook that executes a handler when a keyboard key is used.
 */

export const useKey = (
  keys: string | number | (string | number)[],
  fn: (event: KeyboardEvent) => void,
  opts: UseKeyOptions = {},
): void => {
  const { event = 'keydown', target, options } = opts;

  const keyList: (string | number)[] = useMemo(() => {
    if (Array.isArray(keys)) {
      return keys;
    }

    return [keys];
  }, [keys]);

  const handler = useCallback((handlerEvent: KeyboardEvent): void => {
    if (keyList.some((key) => matchKeyboardEvent(handlerEvent, key))) {
      fn(handlerEvent);
    }
  }, [keyList, fn]);

  useEvent(event, handler, target, options);
};
