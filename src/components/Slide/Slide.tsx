/* eslint-disable react/jsx-props-no-spreading */
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
  easing,
} from '../../utils/transitions';
import { useForkRef } from '../../utils/useForkRef';
import { debounce } from '../../utils/debounce';

interface Props extends Omit<TransitionProps, 'timeout'> {
  children: React.ReactElement;
  direction?: 'left' | 'right' | 'up' | 'down';
  timeout?:
    | number
    | {
        appear?: number;
        enter?: number;
        exit?: number;
      };
}

// Translate the node so he can't be seen on the screen.
// Later, we gonna translate back the node to his original location
// with `none`.`
function getTranslateValue(direction: Props['direction'], node: HTMLElement): string {
  const rect = node.getBoundingClientRect();

  const computedStyle = window.getComputedStyle(node);

  const transform = computedStyle.getPropertyValue('-webkit-transform')
    || computedStyle.getPropertyValue('transform');

  let offsetX = 0;
  let offsetY = 0;

  if (transform && transform !== 'none' && typeof transform === 'string') {
    const transformValues = transform
      .split('(')[1]
      .split(')')[0]
      .split(',');
    offsetX = parseInt(transformValues[4], 10);
    offsetY = parseInt(transformValues[5], 10);
  }

  if (direction === 'left') {
    return `translateX(${window.innerWidth}px) translateX(-${rect.left - offsetX}px)`;
  }

  if (direction === 'right') {
    return `translateX(-${rect.left + rect.width - offsetX}px)`;
  }

  if (direction === 'up') {
    return `translateY(${window.innerHeight}px) translateY(-${rect.top - offsetY}px)`;
  }

  // direction === 'down'
  return `translateY(-${rect.top + rect.height - offsetY}px)`;
}

function setTranslateValue(direction: Props['direction'], node: HTMLElement): void {
  const transform = getTranslateValue(direction, node);

  if (transform) {
    node.style.webkitTransform = transform;
    node.style.transform = transform;
  }
}

const defaultTimeout = {
  enter: duration.enteringScreen,
  exit: duration.leavingScreen,
};

/**
 * Slide in from the edge of the screen.
 * The `direction` property controls which edge of the screen the transition starts from.
 */

export const Slide = React.forwardRef(function Slide(props: Props, ref: React.Ref<React.ReactInstance>) {
  const {
    children,
    direction = 'up',
    in: inProp,
    onEnter,
    onEntering,
    onExit,
    onExited,
    style,
    timeout = defaultTimeout,
    ...other
  } = props;

  const childrenRef = React.useRef<HTMLElement>();

  const handleOwnRef = React.useCallback((instance: HTMLElement) => {
    childrenRef.current = instance;
  }, []);

  const handleRefIntermediary = useForkRef((children as any).ref, handleOwnRef);
  const handleRef = useForkRef(handleRefIntermediary, ref);

  const handleEnter = (_: HTMLElement, isAppearing: boolean): void => {
    const node = childrenRef.current;

    if (!node) return;

    setTranslateValue(direction, node);
    reflow(node);

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  };

  const handleEntering = (_: HTMLElement, isAppearing: boolean): void => {
    const node = childrenRef.current;

    if (!node) return;

    const transitionProps = getTransitionProps(
      { timeout, style },
      {
        mode: 'enter',
      },
    );
    node.style.webkitTransition = create('-webkit-transform', {
      ...transitionProps,
      easing: easing.easeOut,
    });
    node.style.transition = create('transform', {
      ...transitionProps,
      easing: easing.easeOut,
    });

    node.style.webkitTransform = 'none';
    node.style.transform = 'none';

    if (onEntering) {
      onEntering(node, isAppearing);
    }
  };

  const handleExit = (): void => {
    const node = childrenRef.current;

    if (!node) return;

    const transitionProps = getTransitionProps(
      { timeout, style },
      {
        mode: 'exit',
      },
    );

    node.style.webkitTransition = create('-webkit-transform', {
      ...transitionProps,
      easing: easing.sharp,
    });
    node.style.transition = create('transform', {
      ...transitionProps,
      easing: easing.sharp,
    });

    setTranslateValue(direction, node);

    if (onExit) {
      onExit(node);
    }
  };

  const handleExited = (): void => {
    const node = childrenRef.current;

    if (!node) return;

    // No need for transitions when the component is hidden
    node.style.webkitTransition = '';
    node.style.transition = '';

    if (onExited) {
      onExited(node);
    }
  };

  const updatePosition = React.useCallback(() => {
    if (childrenRef.current) {
      setTranslateValue(direction, childrenRef.current);
    }
  }, [direction]);

  React.useEffect(() => {
    // Skip configuration where the position is screen size invariant.
    if (inProp || direction === 'down' || direction === 'right') {
      return undefined;
    }

    const handleResize = debounce(() => {
      if (childrenRef.current) {
        setTranslateValue(direction, childrenRef.current);
      }
    });

    window.addEventListener('resize', handleResize);

    return (): void => {
      handleResize.clear();
      window.removeEventListener('resize', handleResize);
    };
  }, [direction, inProp]);

  React.useEffect(() => {
    if (!inProp) {
      // We need to update the position of the drawer when the direction change and
      // when it's hidden.
      updatePosition();
    }
  }, [inProp, updatePosition]);

  return (
    <Transition
      onEnter={handleEnter}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      appear
      in={inProp}
      timeout={timeout}
      {...other}
    >
      {(state: string, childProps: any): React.ReactElement => React.cloneElement(children, {
        ref: handleRef,
        style: {
          visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
          ...style,
          ...children.props.style,
        },
        ...childProps,
      })}
    </Transition>
  );
});
