/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { Transition } from 'react-transition-group';

import {
  getTransitionProps,
  reflow,
  create,
  TransitionProps,
  duration,
} from '../../utils/transitions';
import { useForkRef } from '../../utils/useForkRef';

interface Props extends Omit<TransitionProps, 'timeout'> {
  /**
   * A single child content element.
   */
  children: React.ReactElement;
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   */
  timeout?:
    | 'auto'
    | number
    | {
        appear?: number;
        enter?: number;
        exit?: number;
      };
}

const styles: { [key: string]: React.CSSProperties } = {
  entering: {
    transform: 'none',
  },
  entered: {
    transform: 'none',
  },
};

const defaultTimeout = {
  enter: duration.enteringScreen,
  exit: duration.leavingScreen,
};

export const Zoom = React.forwardRef(function Zoom(props: Props, ref: React.Ref<React.ReactInstance>) {
  const {
    children,
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    style,
    timeout = defaultTimeout,
    ...other
  } = props;

  const nodeRef = React.useRef<HTMLElement>(null);
  const foreignRef = useForkRef((children as any).ref, ref);
  const handleRef = useForkRef(nodeRef, foreignRef);

  const normalizedTransitionCallback = (callback: any) => (maybeIsAppearing?: boolean): void => {
    if (callback) {
      const node = nodeRef.current;

      // onEnterXxx and onExitXxx callbacks have a different arguments.length value.
      if (maybeIsAppearing === undefined) {
        callback(node);
      } else {
        callback(node, maybeIsAppearing);
      }
    }
  };

  const handleEntering = normalizedTransitionCallback(onEntering);

  const handleEnter = normalizedTransitionCallback((node: HTMLElement, isAppearing: boolean): void => {
    reflow(node); // So the animation always start from the start.

    const transitionProps = getTransitionProps(
      { style, timeout },
      {
        mode: 'enter',
      },
    );

    node.style.webkitTransition = create('transform', transitionProps);
    node.style.transition = create('transform', transitionProps);

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  });

  const handleEntered = normalizedTransitionCallback(onEntered);

  const handleExiting = normalizedTransitionCallback(onExiting);

  const handleExit = normalizedTransitionCallback((node: HTMLElement): void => {
    const transitionProps = getTransitionProps(
      { style, timeout },
      {
        mode: 'exit',
      },
    );

    node.style.webkitTransition = create('transform', transitionProps);
    node.style.transition = create('transform', transitionProps);

    if (onExit) {
      onExit(node);
    }
  });

  const handleExited = normalizedTransitionCallback(onExited);

  return (
    <Transition
      appear
      in={inProp}
      nodeRef={nodeRef}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      onExiting={handleExiting}
      // @ts-ignore
      // Wrong typings
      timeout={timeout === 'auto' ? null : timeout}
      {...other} // eslint-disable-line
    >
      {(state: string, childProps: any): React.ReactElement => React.cloneElement(children, {
        style: {
          transform: 'scale(0)',
          visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
          ...styles[state],
          ...style,
          ...children.props.style,
        },
        ref: handleRef,
        ...childProps,
      })}
    </Transition>
  );
});
