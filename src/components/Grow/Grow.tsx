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
  children: React.ReactElement;
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
    onExit,
    timeout = 'auto',
    style,
    ...other
  } = props;

  const handleRef = useForkRef((children as any).ref, ref);

  const timer = React.useRef<number>();
  const autoTimeout = React.useRef<number>();

  const handleEnter = (node: HTMLElement, isAppearing: boolean): void => {
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
  };

  const handleExit = (node: HTMLElement): void => {
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
  };

  const addEndListener = (_: HTMLElement, done: () => void): void => {
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
      onEnter={handleEnter}
      onExit={handleExit}
      addEndListener={addEndListener}
      // @ts-ignore
      // Wrong typings
      timeout={timeout === 'auto' ? null : timeout}
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
