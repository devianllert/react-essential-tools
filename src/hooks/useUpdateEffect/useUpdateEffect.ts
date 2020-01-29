import { useEffect } from 'react';

import { useFirstMountState } from '../useFirstMountState';

/**
 * Hook that ignores the first invocation (e.g. on mount). The signature is exactly the same as the `useEffect` hook.
 */

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
