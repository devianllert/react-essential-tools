import { useEffect, useState } from 'react';

import { useMountedState } from '../useMountedState';

import { isClient } from '../../utils/isClient';

/**
 * Hook that tracks state of a CSS media query.
 */

export const useMedia = (query: string, defaultState = false): boolean => {
  const [state, setState] = useState(isClient ? (): boolean => window.matchMedia(query).matches : defaultState);
  const isMounted = useMountedState();

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (): void => {
      if (!isMounted()) {
        return;
      }

      setState(!!mql.matches);
    };

    mql.addListener(onChange);

    setState(mql.matches);

    return (): void => mql.removeListener(onChange);
  }, [query, isMounted]);

  return state;
};
