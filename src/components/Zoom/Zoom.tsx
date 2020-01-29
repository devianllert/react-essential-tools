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
  direction?: 'left' | 'right' | 'up' | 'down';
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
    onExit,
    style,
    timeout = defaultTimeout,
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

    node.style.webkitTransition = create('transform', transitionProps);
    node.style.transition = create('transform', transitionProps);

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

    node.style.webkitTransition = create('transform', transitionProps);
    node.style.transition = create('transform', transitionProps);

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
