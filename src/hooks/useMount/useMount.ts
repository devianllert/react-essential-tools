import { useEffect, EffectCallback } from 'react';

/**
 * Hook that calls a function after the component is mounted.
 */

export const useMount = (fn: EffectCallback): void => {
  useEffect(fn, []);
};
