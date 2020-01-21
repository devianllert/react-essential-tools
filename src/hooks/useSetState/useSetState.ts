import { useState, useCallback } from 'react';

/**
 * Hook that creates `setState` method which works similar to how
 * `this.setState` works in class components. It merges object changes into
 * current state.
 */

export const useSetState = <T extends object>(
  initialState: T = {} as T,
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] => {
  const [state, set] = useState<T>(initialState);

  const setState = useCallback((patch) => {
    set((prevState) => ({
      ...prevState,
      ...patch instanceof Function ? patch(prevState) : patch,
    }));
  }, [set]);

  return [state, setState];
};
