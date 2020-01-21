import { useRef } from 'react';

/**
 * Hook that returns `true` if component is just mounted (on first render) and `false` otherwise.
 */

export const useFirstMountState = (): boolean => {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
};
