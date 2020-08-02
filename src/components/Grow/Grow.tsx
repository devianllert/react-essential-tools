/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { Transition } from 'react-transition-group';

import {
  getScale,
  getTransitionProps,
  reflow,
  getAutoHeightDuration,
  create,
  TransitionProps,
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
   *
   * Set to 'auto' to automatically calculate transition time based on height.
   */
  timeout?: 'auto' | number | {
    appear?: number;
    enter?: number;
    exit?: number;
  };
}

const styles: { [key: string]: React.CSSProperties } = {
  entering: {
    opacity: 1,
    transform: getScale(1),
  },
  entered: {
    opacity: 1,
    transform: 'none',
  },
};

/**
 * Grow component expand outwards from the center of the child element, while also fading in from transparent to opaque.
 */

export const Grow = React.forwardRef(function Grow(props: Props, ref: React.Ref<React.ReactInstance>) {
  const {
    children,
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    timeout = 'auto',
    style,
    ...other
  } = props;

  const nodeRef = React.useRef<HTMLElement>(null);
  const foreignRef = useForkRef((children as any).ref, ref);
  const handleRef = useForkRef(nodeRef, foreignRef);

  const timer = React.useRef<number>();
  const autoTimeout = React.useRef<number>();

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

    const { duration: transitionDuration, delay } = getTransitionProps(
      { style, timeout },
      {
        mode: 'enter',
      },
    );

    let autoDuration;

    if (timeout === 'auto') {
      autoDuration = getAutoHeightDuration(node.clientHeight);
      autoTimeout.current = autoDuration;
    } else {
      autoDuration = transitionDuration;
    }

    node.style.transition = [
      create('opacity', {
        duration: autoDuration,
        delay,
      }),
      create('transform', {
        duration: autoDuration * 0.666,
        delay,
      }),
    ].join(',');

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  });

  const handleEntered = normalizedTransitionCallback(onEntered);

  const handleExiting = normalizedTransitionCallback(onExiting);

  const handleExit = normalizedTransitionCallback((node: HTMLElement): void => {
    const { duration: transitionDuration, delay } = getTransitionProps(
      { style, timeout },
      {
        mode: 'exit',
      },
    );

    let autoDuration;

    if (timeout === 'auto') {
      autoDuration = getAutoHeightDuration(node.clientHeight);
      autoTimeout.current = autoDuration;
    } else {
      autoDuration = transitionDuration;
    }

    node.style.transition = [
      create('opacity', {
        duration: autoDuration,
        delay,
      }),
      create('transform', {
        duration: autoDuration * 0.666,
        delay: delay || autoDuration * 0.333,
      }),
    ].join(',');

    node.style.opacity = '0';
    node.style.transform = getScale(0.75);

    if (onExit) {
      onExit(node);
    }
  });

  const handleExited = normalizedTransitionCallback(onExited);

  const addEndListener = (done: () => void): void => {
    if (timeout === 'auto') {
      timer.current = setTimeout(done, autoTimeout.current || 0);
    }
  };

  React.useEffect(() => (): void => {
    clearTimeout(timer.current);
  }, []);

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
      // Wrong typings
      // @ts-ignore
      addEndListener={addEndListener}
      // Wrong typings
      // @ts-ignore
      timeout={timeout === 'auto' ? undefined : timeout}
      {...other} // eslint-disable-line
    >
      {(state: string, childProps: any): React.ReactElement => React.cloneElement(children, {
        style: {
          opacity: 0,
          transform: getScale(0.75),
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
