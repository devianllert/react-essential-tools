import * as React from 'react';

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';

interface Props {
  /**
   * You can wrap a node.
   */
  children?: React.ReactElement;
  /**
   * If `true`, the component will not only prevent server-side rendering.
   * It will also defer the rendering of the children into a different screen frame.
   */
  defer?: boolean;
  /**
   * The fallback content to display.
   */
  fallback?: React.ReactElement;
}

/**
 * NoSsr purposely removes components from the subject of Server Side Rendering (SSR).
 */
export const NoSsr = (props: Props): React.ReactElement => {
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

  return <>{mountedState ? children : fallback}</>;
};
