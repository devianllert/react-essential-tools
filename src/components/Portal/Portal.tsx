/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { createPortal } from 'react-dom';

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';

interface Props {
  children: React.ReactElement;
  container?: React.ReactInstance | (() => React.ReactInstance | null) | null;
  disablePortal?: boolean;
}

export const Portal = React.forwardRef(function Portal(props: Props, ref: React.Ref<React.ReactInstance>) {
  const {
    children,
    container,
    disablePortal = false,
  } = props;

  const [mountNode, setMountNode] = React.useState<React.ReactInstance | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!disablePortal) {
      setMountNode(container || document.body);
    }
  }, [container, disablePortal]);

  if (disablePortal) {
    React.Children.only(children);

    return React.cloneElement(children, { ref });
  }

  return mountNode ? createPortal(children, mountNode as Element) : mountNode;
});
