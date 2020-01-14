/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import PopperJS, {
  ReferenceObject,
  PopperOptions,
  Data,
  Placement,
} from 'popper.js';
import { EnterHandler, ExitHandler } from 'react-transition-group/Transition';

import { setRef } from '../../utils/setRef';
import { useForkRef } from '../../utils/useForkRef';

import { Portal } from '../Portal';

interface ChildProps {
  placement: Placement;
  TransitionProps?: {
    in: boolean;
    onEnter: EnterHandler;
    onExited: ExitHandler;
  };
}

export interface Props {
  anchorEl?: null | ReferenceObject | (() => ReferenceObject);
  children: React.ReactNode | ((props: ChildProps) => React.ReactNode);
  container?: Element;
  disablePortal?: boolean;
  modifiers?: PopperJS.Modifiers;
  open: boolean;
  placement?: Placement;
  popperOptions?: PopperOptions;
  popperRef?: React.Ref<PopperJS>;
  transition?: boolean;
  className?: string;
  id?: string;
  onMouseOver?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
}

function getAnchorEl(anchorEl: null | ReferenceObject | (() => ReferenceObject)): null | ReferenceObject {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl;
}

/**
 * A Popper can be used to display some content on top of another.
 */

export const Popper = React.forwardRef(function Popper(props: Props, ref: React.Ref<HTMLDivElement>) {
  const {
    anchorEl,
    children,
    container,
    disablePortal = false,
    modifiers,
    open,
    placement: initialPlacement = 'bottom',
    popperOptions = {},
    popperRef: popperRefProp,
    transition = false,
    ...other
  } = props;

  const tooltipRef = React.useRef<Element>();
  const popperRef = React.useRef<PopperJS>();
  const ownRef = useForkRef(tooltipRef, ref);

  const [exited, setExited] = React.useState(true);

  const [placement, setPlacement] = React.useState(initialPlacement);

  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
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

    const handlePopperUpdate = (data: Data): void => {
      setPlacement(data.placement);
    };

    const popper = new PopperJS(getAnchorEl(anchorEl) as ReferenceObject, tooltipRef.current, {
      placement,
      ...popperOptions,
      modifiers: {
        ...(disablePortal
          ? {}
          : {
            // It's using scrollParent by default, we can use the viewport when using a portal.
            preventOverflow: {
              boundariesElement: 'window',
            },
          }),
        ...modifiers,
        ...popperOptions.modifiers,
      },
      // We could have been using a custom modifier like react-popper is doing.
      // But it seems this is the best public API for this use case.
      onCreate: (data: Data): void => {
        handlePopperUpdate(data);

        if (popperOptions.onCreate) {
          popperOptions.onCreate(data);
        }
      },
      onUpdate: (data: Data): void => {
        handlePopperUpdate(data);

        if (popperOptions.onUpdate) {
          popperOptions.onUpdate(data);
        }
      },
    });

    popper.scheduleUpdate();

    setRef(popperRefProp, popper);
    setRef(popperRef, popper);
  }, [popperRefProp, anchorEl, disablePortal, modifiers, open, placement, popperOptions]);

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
        style={{
          position: 'fixed',
        }}
        {...other} // eslint-disable-line
      >
        {typeof children === 'function' ? children(childProps) : children}
      </div>
    </Portal>
  );
});
