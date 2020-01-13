/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { createPortal } from 'react-dom';

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useForkRef } from '../../utils/useForkRef';
import { setRef } from '../../utils/setRef';

interface Props {
  children: React.ReactElement;
  container?: React.ReactInstance | (() => React.ReactInstance | null) | null;
  disablePortal?: boolean;
}

/**
 * Portal component renders its children into a new "subtree" outside of current component hierarchy.
 */

export const Portal = React.forwardRef(function Portal(props: Props, ref: React.Ref<React.ReactInstance>) {
  const {
    children,
    container,
    disablePortal = false,
  } = props;
  const [mountNode, setMountNode] = React.useState<React.ReactInstance | null>(null);
  const handleRef = useForkRef((children as any).ref, ref);

  useIsomorphicLayoutEffect(() => {
    if (!disablePortal) {
      setMountNode(container || document.body);
    }
  }, [container, disablePortal]);

  useIsomorphicLayoutEffect(() => {
    if (mountNode && !disablePortal) {
      setRef(ref, mountNode);

      return (): void => {
        setRef(ref, null);
      };
    }

    return undefined;
  }, [ref, mountNode, disablePortal]);

  if (disablePortal) {
    return React.cloneElement(children, { ref: handleRef });
  }

  return mountNode ? createPortal(children, mountNode as Element) : mountNode;
});
