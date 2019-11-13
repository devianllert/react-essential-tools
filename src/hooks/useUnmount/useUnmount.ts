import { useEffect } from 'react';

/**
 * Hook that calls a function after the component is unmounted.
 *
 * @param fn
 */

export const useUnmount = (fn: () => void | undefined): void => {
  useEffect(() => fn, [fn]);
};
