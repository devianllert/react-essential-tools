import { useEffect } from 'react';

import { on, off } from '../../utils/listeners';

/**
 * Hook that subscribes a handler to events.
 */

export const useEvent = (
  type: string,
  handler: (event: any) => void, // eslint-disable-line @typescript-eslint/no-explicit-any
  target: any | null = window, // eslint-disable-line @typescript-eslint/no-explicit-any
  options?: AddEventListenerOptions,
): void => {
  useEffect(() => {
    on(target, type, handler, options);

    return (): void => {
      off(target, type, handler, options);
    };
  }, [type, handler, target, options]);
};
