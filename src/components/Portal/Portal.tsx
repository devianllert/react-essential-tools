/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { createPortal } from 'react-dom';

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useForkRef } from '../../utils/useForkRef';
import { setRef } from '../../utils/setRef';

interface Props {
  /**
   * The children to render into the `container`.
   */
  children: React.ReactElement;
  /**
   * A HTML element or function that returns one.
   * The `container` will have the portal children appended to it.
   *
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */
  container?: React.ReactInstance | (() => React.ReactInstance | null) | null;
  /**
   * The `children` will be inside the DOM hierarchy of the parent component.
   */
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
