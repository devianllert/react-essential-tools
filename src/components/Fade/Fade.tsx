/* eslint-disable react/jsx-props-no-spreading */
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
  children: React.ReactElement;
  timeout?:
    | number
    | {
        appear?: number;
        enter?: number;
        exit?: number;
      };
}

const styles: { [key: string]: React.CSSProperties } = {
  entering: {
    opacity: 1,
  },
  entered: {
    opacity: 1,
  },
};

const defaultTimeout = {
  enter: duration.enteringScreen,
  exit: duration.leavingScreen,
};

/**
 * Fade component fade in from transparent to opaque.
 */

export const Fade = React.forwardRef(function Fade(props: Props, ref: React.Ref<React.ReactInstance>) {
  const {
    children,
    in: inProp,
    onEnter,
    onExit,
    timeout = defaultTimeout,
    style,
    ...other
  } = props;

  const handleRef = useForkRef((children as any).ref, ref);

  const handleEnter = (node: HTMLElement, isAppearing: boolean): void => {
    reflow(node); // So the animation always start from the start.

    const transitionProps = getTransitionProps(
      { style, timeout },
      {
        mode: 'enter',
      },
    );
    node.style.webkitTransition = create('opacity', transitionProps);
    node.style.transition = create('opacity', transitionProps);

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  };

  const handleExit = (node: HTMLElement): void => {
    const transitionProps = getTransitionProps(
      { style, timeout },
      {
        mode: 'exit',
      },
    );
    node.style.webkitTransition = create('opacity', transitionProps);
    node.style.transition = create('opacity', transitionProps);

    if (onExit) {
      onExit(node);
    }
  };

  return (
    <Transition
      appear
      in={inProp}
      onEnter={handleEnter}
      onExit={handleExit}
      timeout={timeout}
      {...other}
    >
      {(state: string, childProps: any): React.ReactElement => React.cloneElement(children, {
        style: {
          opacity: 0,
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
