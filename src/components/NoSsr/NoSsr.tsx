import * as React from 'react';

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';

interface Props {
  children: React.ReactElement;
  defer?: boolean;
  fallback?: React.ReactElement;
}

/**
 * NoSsr purposely removes components from the subject of Server Side Rendering (SSR).
 */

export const NoSsr = (props: Props): React.ReactElement | null => {
  const { children, defer = false, fallback = null } = props;
  const [mountedState, setMountedState] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!defer) {
      setMountedState(true);
    }
  }, [defer]);

  React.useEffect(() => {
    if (defer) {
      setMountedState(true);
    }
  }, [defer]);

  return mountedState ? children : fallback;
};
