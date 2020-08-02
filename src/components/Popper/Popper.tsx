/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import {
  createPopper,
  Modifier,
  Placement,
  VirtualElement,
  Instance,
  Options,
  State,
  ModifierArguments,
} from '@popperjs/core';
import { EnterHandler, ExitHandler } from 'react-transition-group/Transition';

import { setRef } from '../../utils/setRef';
import { useForkRef } from '../../utils/useForkRef';

import { Portal } from '../Portal';

interface ChildProps {
  placement: Placement;
  TransitionProps?: {
    in: boolean;
    onEnter: EnterHandler<undefined>;
    onExited: ExitHandler<HTMLElement>;
  };
}

export interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * A HTML element, [referenceObject](https://popper.js.org/docs/v1/#referenceObject),
   * or a function that returns either.
   * It's used to set the position of the popper.
   * The return value will passed as the reference object of the Popper instance.
   */
  anchorEl?: null | VirtualElement | (() => VirtualElement);
  /**
   * Popper render function or node.
   */
  children: React.ReactNode | ((props: ChildProps) => React.ReactNode);
  /**
   * A HTML element or function that returns one.
   * The `container` will have the portal children appended to it.
   *
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */
  container?: Element;
  /**
   * Specifies the direction of the element's content.
   */
  dir?: 'rtl' | 'ltr';
  /**
   * The `children` will be inside the DOM hierarchy of the parent component.
   */
  disablePortal?: boolean;
  /**
   * Popper.js is based on a "plugin-like" architecture,
   * most of its features are fully encapsulated "modifiers".
   *
   * A modifier is a function that is called each time Popper.js needs to
   * compute the position of the popper.
   * For this reason, modifiers should be very performant to avoid bottlenecks.
   * To learn how to create a modifier, [read the modifiers documentation](https://popper.js.org/docs/v1/#modifiers).
   */
  modifiers?: Partial<Modifier<string, any>>[];
  /**
   * If `true`, the popper is visible.
   */
  open: boolean;
  /**
   * Popper placement.
   */
  placement?: Placement;
  /**
   * Options provided to the [`popper.js`](https://popper.js.org/docs/v1/) instance.
   */
  popperOptions?: Partial<Options>;
  /**
   * A ref that points to the used popper instance.
   */
  popperRef?: React.Ref<Instance>;
  /**
   * Help supporting a react-transition-group/Transition component.
   */
  transition?: boolean;
}

// eslint-disable-next-line arrow-body-style
const getAnchorEl = (anchorEl: null | VirtualElement | (() => VirtualElement)): null | VirtualElement => {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl;
};

const flipPlacement = (placement: Placement, dir: 'rtl' | 'ltr'): Placement => {
  const direction = dir || 'ltr';

  if (direction === 'ltr') {
    return placement;
  }

  switch (placement) {
    case 'bottom-end':
      return 'bottom-start';
    case 'bottom-start':
      return 'bottom-end';
    case 'top-end':
      return 'top-start';
    case 'top-start':
      return 'top-end';
    default:
      return placement;
  }
};

/**
 * A Popper can be used to display some content on top of another.
 */

export const Popper = React.forwardRef(function Popper(props: Props, ref: React.Ref<HTMLDivElement>) {
  const {
    anchorEl,
    children,
    container,
    dir = 'ltr',
    disablePortal = false,
    modifiers,
    open,
    placement: initialPlacement = 'bottom',
    popperOptions = {},
    popperRef: popperRefProp,
    transition = false,
    ...other
  } = props;

  const tooltipRef = React.useRef<HTMLElement>();
  const popperRef = React.useRef<Instance>();
  const ownRef = useForkRef(tooltipRef, ref);

  const [exited, setExited] = React.useState(true);

  const rtlPlacement = flipPlacement(initialPlacement, dir);
  const [placement, setPlacement] = React.useState(rtlPlacement);

  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.forceUpdate();
    }
  });

  const handleOpen = React.useCallback(() => {
    if (!tooltipRef.current || !anchorEl || !open) {
      return;
    }

    if (popperRef.current) {
      popperRef.current.destroy();
      popperRef.current = undefined;
    }

    const handlePopperUpdate = (data: Partial<State>): void => {
      setPlacement(data.placement || 'bottom');
    };

    const popper = createPopper(getAnchorEl(anchorEl) as VirtualElement, tooltipRef.current, {
      placement: rtlPlacement,
      ...popperOptions,
      modifiers: [
        {
          name: 'updatePlacement',
          phase: 'afterWrite',
          enabled: true,
          fn: (data: ModifierArguments<Options>): void => {
            handlePopperUpdate(data.state);
          },
        },
        (disablePortal
          ? {}
          : {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'document',
            },
          }),
        ...(modifiers || []),
        ...(popperOptions.modifiers || []),
      ],
      onFirstUpdate: (data: Partial<State>): void => {
        handlePopperUpdate(data);

        if (popperOptions.onFirstUpdate) {
          popperOptions.onFirstUpdate(data);
        }
      },
    });

    setRef(popperRefProp, popper);
    setRef(popperRef, popper);
  }, [popperRefProp, anchorEl, disablePortal, modifiers, open, rtlPlacement, popperOptions]);

  const handleRef = React.useCallback((node: HTMLDivElement): void => {
    setRef(ownRef, node);

    handleOpen();
  }, [ownRef, handleOpen]);

  const handleEnter = (): void => {
    setExited(false);
  };

  const handleClose = (): void => {
    if (!popperRef.current) {
      return;
    }

    popperRef.current.destroy();
    popperRef.current = undefined;
  };

  const handleExited = (): void => {
    setExited(true);

    handleClose();
  };

  // Let's update the popper position.
  React.useEffect(() => handleOpen(), [handleOpen]);

  React.useEffect(() => handleClose, []);

  React.useEffect(() => {
    if (!open && !transition) {
      // Otherwise handleExited will call this.
      handleClose();
    }
  }, [open, transition]);

  if (!open && (!transition || exited)) {
    return null;
  }

  const childProps: ChildProps = { placement };

  if (transition) {
    childProps.TransitionProps = {
      in: open,
      onEnter: handleEnter,
      onExited: handleExited,
    };
  }

  return (
    <Portal disablePortal={disablePortal} container={container}>
      <div
        ref={handleRef}
        role="tooltip"
        {...other} // eslint-disable-line
      >
        {typeof children === 'function' ? children(childProps) : children}
      </div>
    </Portal>
  );
});
