import * as React from 'react';
import styled from 'styled-components';

import { useIsFocusVisible } from '../../utils/focusVisible';

import { Arrow } from './Arrow';
import { TooltipBox } from './TooltipBox';
import { Popper } from '../Popper';

interface Props {
  arrow?: boolean;
  children: React.ReactElement;
  disableFocusListener?: boolean;
  disableHoverListener?: boolean;
  disableTouchListener?: boolean;
  enterDelay?: number;
  enterTouchDelay?: number;
  id?: string;
  interactive?: boolean;
  leaveDelay?: number;
  leaveTouchDelay?: number;
  onClose?: (event: React.ChangeEvent<{}>) => void;
  onOpen?: (event: React.ChangeEvent<{}>) => void;
  open?: boolean;
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  PopperProps?: Partial<import('../Popper/Popper').Props>;
  title: React.ReactNode;
}

interface StyledPopperProps {
  interactive?: boolean;
}

const StyledPopper = styled(Popper)<StyledPopperProps>`
  z-index: 15;
  pointer-events: ${(props): string => (props.interactive ? 'auto' : 'none')};
`;

export const Tooltip = (props: Props): React.ReactElement => {
  const {
    arrow = false,
    children,
    disableFocusListener = false,
    disableHoverListener = false,
    disableTouchListener = false,
    enterDelay = 0,
    enterTouchDelay = 700,
    id,
    interactive = false,
    leaveDelay = 0,
    leaveTouchDelay = 1500,
    onClose,
    onOpen,
    open: openProp,
    placement = 'bottom',
    PopperProps,
    title,
    ...other
  } = props;

  const { isFocusVisible, onBlurVisible, ref: focusVisibleRef } = useIsFocusVisible();

  const [openState, setOpenState] = React.useState(false);
  const [arrowRef, setArrowRef] = React.useState();
  const [childIsFocusVisible, setChildIsFocusVisible] = React.useState(false);
  const [, forceUpdate] = React.useState(0);
  const [childNode, setChildNode] = React.useState<Element>();

  const ignoreNonTouchEvents = React.useRef(false);
  const { current: isControlled } = React.useRef(openProp != null);

  const defaultId = React.useRef<string>();
  const closeTimer = React.useRef<number>();
  const enterTimer = React.useRef<number>();
  const leaveTimer = React.useRef<number>();
  const touchTimer = React.useRef<number>();

  const handleRef = React.useCallback(
    (instance: HTMLElement) => {
      setChildNode(instance);
      focusVisibleRef(instance);
    },
    [focusVisibleRef],
  );

  React.useEffect(() => {
    // Fallback to this default id when possible.
    // Use the random value for client-side rendering only.
    // We can't use it server-side.
    if (!defaultId.current) {
      defaultId.current = `tooltip-${Math.round(Math.random() * 1e5)}`;
    }

    // Rerender with defaultId and childNode.
    if (openProp) {
      forceUpdate((n) => n + 1);
    }
  }, [openProp]);

  React.useEffect(
    () => (): void => {
      clearTimeout(closeTimer.current);
      clearTimeout(enterTimer.current);
      clearTimeout(leaveTimer.current);
      clearTimeout(touchTimer.current);
    },
    [],
  );

  const handleOpen = (event: React.ChangeEvent): void => {
    // The mouseover event will trigger for every nested element in the tooltip.
    // We can skip rerendering when the tooltip is already open.
    // We are using the mouseover event instead of the mouseenter event to fix a hide/show issue.
    if (!isControlled && !openState) {
      setOpenState(true);
    }

    if (onOpen) {
      onOpen(event);
    }
  };

  const handleEnter = (event: React.ChangeEvent): void => {
    const childrenProps = children.props;

    if (event.type === 'mouseover' && childrenProps.onMouseOver) {
      childrenProps.onMouseOver(event);
    }

    if (ignoreNonTouchEvents.current && event.type !== 'touchstart') {
      return;
    }

    // Remove the title ahead of time.
    // We don't want to wait for the next render commit.
    // We would risk displaying two tooltips at the same time (native + this one).
    if (childNode) {
      childNode.removeAttribute('title');
    }

    clearTimeout(enterTimer.current);
    clearTimeout(leaveTimer.current);

    if (enterDelay) {
      event.persist();

      enterTimer.current = window.setTimeout(() => {
        handleOpen(event);
      }, enterDelay);
    } else {
      handleOpen(event);
    }
  };

  const handleBlur = (): void => {
    if (childIsFocusVisible) {
      setChildIsFocusVisible(false);
      onBlurVisible();
    }
  };

  const handleFocus = (event: React.ChangeEvent): void => {
    // Workaround for https://github.com/facebook/react/issues/7769
    // The autoFocus of React might trigger the event before the componentDidMount.
    // We need to account for this eventuality.
    if (!childNode) {
      setChildNode(event.currentTarget);
    }

    if (isFocusVisible(event)) {
      setChildIsFocusVisible(true);
      handleEnter(event);
    }

    const childrenProps = children.props;
    if (childrenProps.onFocus) {
      childrenProps.onFocus(event);
    }
  };

  const handleClose = (event: React.ChangeEvent): void => {
    if (!isControlled) {
      setOpenState(false);
    }

    if (onClose) {
      onClose(event);
    }

    clearTimeout(closeTimer.current);

    closeTimer.current = window.setTimeout(() => {
      ignoreNonTouchEvents.current = false;
    }, 150);
  };

  const handleLeave = (event: React.ChangeEvent): void => {
    const childrenProps = children.props;

    if (event.type === 'blur') {
      if (childrenProps.onBlur) {
        childrenProps.onBlur(event);
      }
      handleBlur();
    }

    if (event.type === 'mouseleave' && childrenProps.onMouseLeave) {
      childrenProps.onMouseLeave(event);
    }

    clearTimeout(enterTimer.current);
    clearTimeout(leaveTimer.current);

    event.persist();

    leaveTimer.current = window.setTimeout(() => {
      handleClose(event);
    }, leaveDelay);
  };

  const handleTouchStart = (event: React.ChangeEvent): void => {
    ignoreNonTouchEvents.current = true;
    const childrenProps = children.props;

    if (childrenProps.onTouchStart) {
      childrenProps.onTouchStart(event);
    }

    clearTimeout(leaveTimer.current);
    clearTimeout(closeTimer.current);
    clearTimeout(touchTimer.current);

    event.persist();

    touchTimer.current = window.setTimeout(() => {
      handleEnter(event);
    }, enterTouchDelay);
  };

  const handleTouchEnd = (event: React.ChangeEvent): void => {
    if (children.props.onTouchEnd) {
      children.props.onTouchEnd(event);
    }

    clearTimeout(touchTimer.current);
    clearTimeout(leaveTimer.current);

    event.persist();

    leaveTimer.current = window.setTimeout(() => {
      handleClose(event);
    }, leaveTouchDelay);
  };

  let open: boolean = isControlled ? openProp || false : openState;

  // There is no point in displaying an empty tooltip.
  if (title === '') {
    open = false;
  }

  const shouldShowNativeTitle = !open && !disableHoverListener;

  const childrenProps = {
    'aria-describedby': open ? id || defaultId.current : null,
    title: shouldShowNativeTitle && typeof title === 'string' ? title : null,
    ...other,
    ...children.props,
  };

  if (!disableTouchListener) {
    childrenProps.onTouchStart = handleTouchStart;
    childrenProps.onTouchEnd = handleTouchEnd;
  }

  if (!disableHoverListener) {
    childrenProps.onMouseOver = handleEnter;
    childrenProps.onMouseLeave = handleLeave;
  }

  if (!disableFocusListener) {
    childrenProps.onFocus = handleFocus;
    childrenProps.onBlur = handleLeave;
  }

  const interactiveWrapperListeners = interactive
    ? {
      onMouseOver: childrenProps.onMouseOver,
      onMouseLeave: childrenProps.onMouseLeave,
      onFocus: childrenProps.onFocus,
      onBlur: childrenProps.onBlur,
    }
    : {};

  return (
    <>
      {React.cloneElement(children, { ref: handleRef, ...childrenProps })}

      <StyledPopper
        placement={placement}
        anchorEl={childNode}
        interactive={interactive}
        open={childNode ? open : false}
        id={childrenProps['aria-describedby']}
        transition
        popperOptions={{
          modifiers: {
            arrow: {
              enabled: Boolean(arrowRef),
              element: arrowRef,
            },
          },
        }}
        {...interactiveWrapperListeners} // eslint-disable-line
        {...PopperProps} // eslint-disable-line
      >
        {({ placement: placementInner }): React.ReactElement => (
          <TooltipBox
            interactive={interactive}
            arrow={arrow}
            placement={placementInner.split('-')[0]}
          >
            {title}
            {arrow ? <Arrow placement={placementInner.split('-')[0]} ref={setArrowRef} /> : null}
          </TooltipBox>
        )}
      </StyledPopper>
    </>
  );
};
