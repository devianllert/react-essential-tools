/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from 'react';
import { useFirstMountState } from '../useFirstMountState';

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) effect();
  }, deps);
};
