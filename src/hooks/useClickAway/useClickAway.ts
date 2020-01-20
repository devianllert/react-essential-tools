import { useEffect, useRef, RefObject } from 'react';

import { on, off } from '../../utils/listeners';

/**
 * Hook that triggers a callback when user clicks outside the target element.
 */

export const useClickAway = (ref: RefObject<HTMLElement>, handler: (event: MouseEvent) => void): void => {
  const savedCallback = useRef(handler);

  useEffect(() => {
    savedCallback.current = handler;
  }, [handler]);

  useEffect(
    (): (() => void) => {
      const listener = (event: MouseEvent): void => {
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
