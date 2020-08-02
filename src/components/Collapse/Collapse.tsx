/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

import {
  getTransitionProps,
  TransitionProps,
  duration,
  getAutoHeightDuration,
  create,
} from '../../utils/transitions';

import { useForkRef } from '../../utils/useForkRef';

interface Props extends Omit<TransitionProps, 'timeout'> {
  /**
   * @ignore
   */
  className?: string;
  /**
   * The content node to be collapsed.
   */
  children: React.ReactElement;
  /**
   * The width (horizontal) or height (vertical) of the container when collapsed.
   */
  collapsedSize?: string | number;
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component?: React.ComponentType<TransitionProps>;
  /**
   * The collapse transition orientation.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   *
   * Set to 'auto' to automatically calculate transition time based on height.
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

interface ContainerProps {
  entered: boolean;
  hidden: boolean;
  isHorizontal: boolean;
}

const Container = styled.div<ContainerProps>`
  height: ${(props): string => (props.entered || props.isHorizontal ? 'auto' : '0')};
  width: ${(props): string => (props.entered && props.isHorizontal ? 'auto' : 'unset')};
  overflow: ${(props): string => (props.entered ? 'visible' : 'hidden')};
  visibility: ${(props): string => (props.hidden ? 'hidden' : 'visible')};
  transition: ${(props): string => create(props.isHorizontal ? 'width' : 'height')};
`;

const Wrapper = styled.div<{ isHorizontal: boolean }>`
  display: flex;
  width: 100%;

  ${(props): string | false => props.isHorizontal && `
    width: auto;
    height: 100%;
  `}
`;

const WrapperInner = styled.div<{ isHorizontal: boolean }>`
  width: 100%;

  ${(props): string | false => props.isHorizontal && `
    width: auto;
    height: 100%;
  `}
`;

export const Collapse = React.forwardRef(function Collapse(props: Props, ref: React.Ref<React.ReactInstance>) {
  const {
    children,
    className,
    collapsedSize: collapsedSizeProp = '0px',
    orientation = 'vertical',
    component: Component = 'div',
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    style,
    timeout = duration.standard,
    ...other
  } = props;

  const timer = React.useRef<number>();
  const nodeRef = React.useRef<HTMLElement>(null);
  const handleRef = useForkRef(ref, nodeRef);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const autoTransitionDuration = React.useRef<number>();
  const collapsedSize = typeof collapsedSizeProp === 'number' ? `${collapsedSizeProp}px` : collapsedSizeProp;
  const isHorizontal = orientation === 'horizontal';
  const size = isHorizontal ? 'width' : 'height';

  React.useEffect(() => (): void => {
    clearTimeout(timer.current);
  }, []);

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

  const getWrapperSize = (): number => (wrapperRef.current
    ? wrapperRef.current[isHorizontal ? 'clientWidth' : 'clientHeight']
    : 0);

  const handleEnter = normalizedTransitionCallback((node: HTMLElement, isAppearing: boolean) => {
    if (wrapperRef.current) {
      // Set absolute position to get the size of collapsed content
      wrapperRef.current.style.position = 'absolute';
    }
    node.style[size] = collapsedSize;

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  });

  const handleEntering = normalizedTransitionCallback((node: HTMLElement, isAppearing: boolean) => {
    const wrapperSize = getWrapperSize();

    if (wrapperRef.current) {
      // After the size is read reset the position back to default
      wrapperRef.current.style.position = '';
    }

    const { duration: transitionDuration } = getTransitionProps(
      { style, timeout },
      {
        mode: 'enter',
      },
    );

    if (timeout === 'auto') {
      const duration2 = getAutoHeightDuration(wrapperSize);
      node.style.transitionDuration = `${duration2}ms`;
      autoTransitionDuration.current = duration2;
    } else {
      node.style.transitionDuration = typeof transitionDuration === 'string'
        ? transitionDuration
        : `${transitionDuration}ms`;
    }

    node.style[size] = `${wrapperSize}px`;

    if (onEntering) {
      onEntering(node, isAppearing);
    }
  });

  const handleEntered = normalizedTransitionCallback((node: HTMLElement, isAppearing: boolean) => {
    node.style[size] = 'auto';

    if (onEntered) {
      onEntered(node, isAppearing);
    }
  });

  const handleExit = normalizedTransitionCallback((node: HTMLElement) => {
    node.style[size] = `${getWrapperSize()}px`;

    if (onExit) {
      onExit(node);
    }
  });

  const handleExited = normalizedTransitionCallback(onExited);

  const handleExiting = normalizedTransitionCallback((node: HTMLElement) => {
    const wrapperSize = getWrapperSize();
    const { duration: transitionDuration } = getTransitionProps(
      { style, timeout },
      {
        mode: 'exit',
      },
    );

    if (timeout === 'auto') {
      // TODO: rename getAutoHeightDuration to something more generic (width support)
      // Actually it just calculates animation duration based on size
      const duration2 = getAutoHeightDuration(wrapperSize);
      node.style.transitionDuration = `${duration2}ms`;
      autoTransitionDuration.current = duration2;
    } else {
      node.style.transitionDuration = typeof transitionDuration === 'string'
        ? transitionDuration
        : `${transitionDuration}ms`;
    }

    node.style[size] = collapsedSize;

    if (onExiting) {
      onExiting(node);
    }
  });

  const addEndListener = (done: () => void): void => {
    if (timeout === 'auto') {
      timer.current = setTimeout(done, autoTransitionDuration.current || 0);
    }
  };

  return (
    <Transition
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
      {...other}
    >
      {(state: string, childProps: any): React.ReactElement => (
        <Container
          as={Component}
          className={className}
          isHorizontal={isHorizontal}
          entered={state === 'entered'}
          hidden={state === 'exited' && !inProp && collapsedSize === '0px'}
          style={{
            [isHorizontal ? 'minWidth' : 'minHeight']: collapsedSize,
            ...style,
          }}
          ref={handleRef}
          {...childProps}
        >
          <Wrapper isHorizontal={isHorizontal} ref={wrapperRef}>
            <WrapperInner isHorizontal={isHorizontal}>{children}</WrapperInner>
          </Wrapper>
        </Container>
      )}
    </Transition>
  );
});
