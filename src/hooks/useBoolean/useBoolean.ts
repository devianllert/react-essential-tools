import { useState, useCallback } from 'react';

/**
 * Hook that tracks value of a boolean
 */

export const useBoolean = (initialBool = true): [boolean, (bool?: boolean) => void] => {
  const [bool, setBool] = useState<boolean>(initialBool);

  const toggle = useCallback(
    (nextValue?: boolean): void => {
      if (typeof nextValue === 'boolean') {
        setBool(nextValue);

        return;
      }

      setBool((currentValue): boolean => !currentValue);
    },
    [setBool],
  );

  return [bool, toggle];
};
