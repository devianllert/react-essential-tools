import { useMemo, useCallback } from 'react';

import { matchKeyboardKey } from '../../utils/matchKeyboardKey';

import { useEvent } from '../useEvent';

interface UseKeyOptions {
  event?: 'keydown' | 'keypress' | 'keyup';
  target?: EventTarget;
  options?: AddEventListenerOptions;
}

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
    if (keyList.some((key) => matchKeyboardKey(handlerEvent, key))) {
      fn(handlerEvent);
    }
  }, [keyList, fn]);

  useEvent(event, handler, target, options);
};
