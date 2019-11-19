import * as React from 'react';
import PopperJS, {
  ReferenceObject,
  PopperOptions,
  Data,
  Placement,
} from 'popper.js';

import { Portal } from '../Portal';

interface ChildProps {
  placement: Placement;
  TransitionProps?: object;
}

export interface Props {
  anchorEl?: null | ReferenceObject | (() => ReferenceObject);
  children: React.ReactNode | ((props: ChildProps) => React.ReactNode);
  container?: Element;
  disablePortal?: boolean;
  keepMounted?: boolean;
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

export const Popper = (props: Props): React.ReactElement | null => {
  const {
    anchorEl,
    children,
    container,
    disablePortal = false,
    keepMounted = false,
    modifiers,
    open,
    placement: initialPlacement = 'bottom',
    popperOptions = {},
    transition = false,
    ...other
  } = props;

  const tooltipRef = React.useRef<Element>();
  const popperRef = React.useRef<PopperJS>();

  const [exited, setExited] = React.useState(true);

  const [placement, setPlacement] = React.useState(initialPlacement);

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

    popperRef.current = popper;
  }, [anchorEl, disablePortal, modifiers, open, placement, popperOptions]);

  const handleRef = React.useCallback((node) => {
    tooltipRef.current = node;

    handleOpen();
  }, [tooltipRef, handleOpen]);

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

  if (!keepMounted && !open && (!transition || exited)) {
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
};
