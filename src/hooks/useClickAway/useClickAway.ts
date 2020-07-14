import { useEffect, useRef, RefObject } from 'react';

import { on, off } from '../../utils/listeners';

/**
 * Hook that triggers a callback when the user clicks outside the target element.
 */

export const useClickAway = <T extends Event = Event>(
  ref: RefObject<HTMLElement | null>,
  handler: (event: T) => void,
): void => {
  const savedCallback = useRef(handler);

  useEffect(() => {
    savedCallback.current = handler;
  }, [handler]);

  useEffect(
    (): (() => void) => {
      const listener = (event: T): void => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }

        savedCallback.current(event);
      };

      on(document, 'mousedown', listener);
      on(document, 'touchstart', listener);

      return (): void => {
        off(document, 'mousedown', listener);
        off(document, 'touchstart', listener);
      };
    },
    [ref],
  );
};
