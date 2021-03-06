/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import styled from 'styled-components';

import { useForkRef } from '../../utils/useForkRef';
import { TransitionProps } from '../../utils/transitions';

import { Portal } from '../Portal';
import { ModalManager, ariaHidden, Modal as ModalType } from './ModalManager';
import { TrapFocus } from './TrapFocus';
import { SimpleBackdrop } from './SimpleBackdrop';

interface BackdropProps extends React.HTMLAttributes<HTMLDivElement>{
  open: boolean;
  invisible?: boolean;
  transitionDuration?: TransitionProps['timeout'];
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * A single child content element.
   */
  children: React.ReactElement;
  /**
   * A backdrop component. This prop enables custom backdrop rendering.
   */
  BackdropComponent?: React.ComponentType<BackdropProps>;
  /**
   * Props applied to the [`Backdrop`](/api/backdrop/) element.
   */
  BackdropProps?: Partial<BackdropProps>;
  /**
   * When set to true the Modal waits until a nested Transition is completed before closing.
   */
  closeAfterTransition?: boolean;
  /**
   * A HTML element or function that returns one.
   * The `container` will have the portal children appended to it.
   *
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */
  container?: HTMLElement | (() => HTMLElement | null) | null;
  /**
   * If `true`, the modal will not automatically shift focus to itself when it opens, and
   * replace it to the last focused element when it closes.
   * This also works correctly with any modal children that have the `disableAutoFocus` prop.
   *
   * Generally this should never be set to `true` as it makes the modal less
   * accessible to assistive technologies, like screen readers.
   */
  disableAutoFocus?: boolean;
  /**
   * If `true`, clicking the backdrop will not fire `onClose`.
   */
  disableBackdropClick?: boolean;
  /**
   * If `true`, the modal will not prevent focus from leaving the modal while open.
   *
   * Generally this should never be set to `true` as it makes the modal less
   * accessible to assistive technologies, like screen readers.
   */
  disableEnforceFocus?: boolean;
  /**
   * If `true`, hitting escape will not fire `onClose`.
   */
  disableEscapeKeyDown?: boolean;
  /**
   * The `children` will be inside the DOM hierarchy of the parent component.
   */
  disablePortal?: boolean;
  /**
   * If `true`, the modal will not restore focus to previously focused element once
   * modal is hidden.
   */
  disableRestoreFocus?: boolean;
  /**
   * Disable the scroll lock behavior.
   */
  disableScrollLock?: boolean;
  /**
   * If `true`, the backdrop is not rendered.
   */
  hideBackdrop?: boolean;
  /**
   * State manager for containers and the modals in those containers
   */
  manager?: ModalManager;
  /**
   * Callback fired when the backdrop is clicked.
   */
  onBackdropClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Callback fired when the component requests to be closed.
   * The `reason` parameter can optionally be used to control the response to `onClose`.
   *
   * @param {object} event The event source of the callback.
   * @param {string} reason Can be: `"escapeKeyDown"`, `"backdropClick"`.
   */
  onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
  /**
   * Callback fired when the escape key is pressed,
   * `disableEscapeKeyDown` is false and the modal is in focus.
   */
  onEscapeKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  /**
   * If `true`, the modal is open.
   */
  open: boolean;
}

const getContainer = (
  container: HTMLElement | undefined | null | (() => HTMLElement | undefined | null),
  // eslint-disable-next-line arrow-body-style
): HTMLElement | undefined | null => {
  return typeof container === 'function' ? container() : container;
};

const getHasTransition = (props: { children: any }): boolean => {
  if (props.children) {
    return Object.prototype.hasOwnProperty.call(props.children.props, 'in');
  }

  return false;
};

const Content = styled.div<{ hidden?: boolean }>`
  position: fixed;
  z-index: 10;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  visibility: ${({ hidden }): string => (hidden ? 'hidden' : 'visible')};
`;

// A modal manager used to track and manage the state of open Modals.
// Modals don't open on the server so this won't conflict with concurrent requests.
const defaultManager = new ModalManager();

/**
 * Modal is a lower-level construct that can be used for components like:
 *
 * - Dialog
 * - Drawer
 * - Menu
 * - Popover
 */
export const Modal = React.forwardRef(function Modal(props: Props, ref: React.Ref<HTMLDivElement>) {
  const {
    children,
    BackdropComponent = SimpleBackdrop,
    BackdropProps,
    closeAfterTransition = false,
    container,
    disableAutoFocus = false,
    disableBackdropClick = false,
    disableEnforceFocus = false,
    disableEscapeKeyDown = false,
    disablePortal = false,
    disableRestoreFocus = false,
    disableScrollLock = false,
    hideBackdrop = false,
    manager = defaultManager,
    onBackdropClick,
    onClose,
    onEscapeKeyDown,
    open,
    ...other
  } = props;

  const [exited, setExited] = React.useState(true);
  const modal = React.useRef<ModalType>({});
  const mountNodeRef = React.useRef<HTMLElement>();
  const modalRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(modalRef, ref);
  const hasTransition = getHasTransition(props);

  const getDoc = (): Document => mountNodeRef.current?.ownerDocument || document;

  const getModal = (): ModalType => {
    modal.current.modalRef = modalRef.current;
    modal.current.mountNode = mountNodeRef.current;

    return modal.current;
  };

  const handleMounted = React.useCallback((): void => {
    manager.mount(getModal(), { disableScrollLock });

    // Fix a bug on Chrome where the scroll isn't initially 0.
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [disableScrollLock, manager]);

  const handleOpen = React.useCallback(() => {
    const resolvedContainer = getContainer(container) || getDoc().body;

    manager.add(getModal(), resolvedContainer);

    // The element was already mounted.
    if (modalRef.current) {
      handleMounted();
    }
  }, [container, handleMounted, manager]);

  const isTopModal = React.useCallback(() => manager.isTopModal(getModal()), [manager]);

  const handlePortalRef = React.useCallback((node) => {
    mountNodeRef.current = node;

    if (!node) {
      return;
    }

    if (open && isTopModal()) {
      handleMounted();

      return;
    }

    if (modalRef.current) {
      ariaHidden(modalRef.current, true);
    }
  }, [handleMounted, isTopModal, open]);

  const handleClose = React.useCallback(() => {
    manager.remove(getModal());
  }, [manager]);

  React.useEffect(() => handleClose, [handleClose]);

  React.useEffect(() => {
    if (open) {
      handleOpen();
    } else if (!hasTransition || !closeAfterTransition) {
      handleClose();
    }
  }, [open, handleClose, hasTransition, closeAfterTransition, handleOpen]);

  if (!open && (!hasTransition || exited)) {
    return null;
  }

  const handleEnter = (): void => {
    setExited(false);
  };

  const handleExited = (): void => {
    setExited(true);

    if (closeAfterTransition) {
      handleClose();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (onBackdropClick) {
      onBackdropClick(event);
    }

    if (!disableBackdropClick && onClose) {
      onClose(event, 'backdropClick');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    // The handler doesn't take event.defaultPrevented into account:
    //
    // event.preventDefault() is meant to stop default behaviours like
    // clicking a checkbox to check it, hitting a button to submit a form,
    // and hitting left arrow to move the cursor in a text input etc.
    // Only special HTML elements have these default behaviors.
    if (event.key !== 'Escape' || !isTopModal()) {
      return;
    }

    // Swallow the event, in case someone is listening for the escape key on the body.
    event.stopPropagation();

    if (onEscapeKeyDown) {
      onEscapeKeyDown(event);
    }

    if (!disableEscapeKeyDown && onClose) {
      onClose(event, 'escapeKeyDown');
    }
  };

  const childProps: any = {};

  if (children.props.tabIndex === undefined) {
    childProps.tabIndex = children.props.tabIndex || '-1';
  }

  // It's a Transition like component
  if (hasTransition) {
    childProps.onEnter = (): void => {
      handleEnter();

      if (children.props.onEnter) {
        children.props.onEnter();
      }
    };

    childProps.onExited = (): void => {
      handleExited();

      if (children.props.onExited) {
        children.props.onExited();
      }
    };
  }

  /*
    Marking an element with the role presentation indicates to assistive technology
    that this element should be ignored; it exists to support the web application and
    is not meant for humans to interact with directly.
    https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
  */
  return (
    <Portal ref={handlePortalRef} container={container} disablePortal={disablePortal}>
      <Content
        role="presentation"
        hidden={!open && exited}
        ref={handleRef}
        onKeyDown={handleKeyDown}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...other}
      >
        <BackdropComponent
          open={!hideBackdrop && open}
          onClick={handleBackdropClick}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...BackdropProps}
        />

        <TrapFocus
          disableEnforceFocus={disableEnforceFocus}
          disableAutoFocus={disableAutoFocus}
          disableRestoreFocus={disableRestoreFocus}
          getDoc={getDoc}
          isEnabled={isTopModal}
          open={open}
        >
          {React.cloneElement(children, childProps)}
        </TrapFocus>
      </Content>
    </Portal>
  );
});
