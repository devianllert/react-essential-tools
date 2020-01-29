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

interface Props extends Omit<TransitionProps, 'timeout'> {
  children: React.ReactElement;
  collapsedHeight?: string | number;
  component?: React.ComponentType<TransitionProps>;
  className?: string;
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
}

const Container = styled.div<ContainerProps>`
  height: ${(props): string => (props.entered ? 'auto' : '0')};
  overflow: ${(props): string => (props.entered ? 'visible' : 'hidden')};
  visibility: ${(props): string => (props.hidden ? 'hidden' : 'visible')};
  transition: ${create('height')};
`;

const Wrapper = styled.div`
  display: flex;
`;

const WrapperInner = styled.div`
  width: '100%';
`;

export const Collapse = React.forwardRef(function Collapse(props: Props, ref: React.Ref<React.ReactInstance>) {
  const {
    children,
    className,
    collapsedHeight: collapsedHeightProp = '0px',
    component: Component = 'div',
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExiting,
    style,
    timeout = duration.standard,
    ...other
  } = props;

  const timer = React.useRef<number>();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const autoTransitionDuration = React.useRef<number>();
  const collapsedHeight = typeof collapsedHeightProp === 'number' ? `${collapsedHeightProp}px` : collapsedHeightProp;

  React.useEffect(() => {
    const time = timer.current;

    return (): void => {
      clearTimeout(time);
    };
  }, []);

  const handleEnter = (node: HTMLElement, isAppearing: boolean): void => {
    node.style.height = collapsedHeight;

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  };

  const handleEntering = (node: HTMLElement, isAppearing: boolean): void => {
    const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0;

    const { duration: transitionDuration } = getTransitionProps(
      { style, timeout },
      {
        mode: 'enter',
      },
    );

    if (timeout === 'auto') {
      const duration2 = getAutoHeightDuration(wrapperHeight);

      node.style.transitionDuration = `${duration2}ms`;
      autoTransitionDuration.current = duration2;
    } else {
      node.style.transitionDuration = typeof transitionDuration === 'string'
        ? transitionDuration
        : `${transitionDuration}ms`;
    }

    node.style.height = `${wrapperHeight}px`;

    if (onEntering) {
      onEntering(node, isAppearing);
    }
  };

  const handleEntered = (node: HTMLElement, isAppearing: boolean): void => {
    node.style.height = 'auto';

    if (onEntered) {
      onEntered(node, isAppearing);
    }
  };

  const handleExit = (node: HTMLElement): void => {
    const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0;
    node.style.height = `${wrapperHeight}px`;

    if (onExit) {
      onExit(node);
    }
  };

  const handleExiting = (node: HTMLElement): void => {
    const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0;

    const { duration: transitionDuration } = getTransitionProps(
      { style, timeout },
      {
        mode: 'exit',
      },
    );

    if (timeout === 'auto') {
      const duration2 = getAutoHeightDuration(wrapperHeight);

      node.style.transitionDuration = `${duration2}ms`;
      autoTransitionDuration.current = duration2;
    } else {
      node.style.transitionDuration = typeof transitionDuration === 'string'
        ? transitionDuration
        : `${transitionDuration}ms`;
    }

    node.style.height = collapsedHeight;

    if (onExiting) {
      onExiting(node);
    }
  };

  const addEndListener = (_: HTMLElement, done: Function): void => {
    if (timeout === 'auto') {
      timer.current = setTimeout(done, autoTransitionDuration.current || 0);
    }
  };

  return (
    <Transition
      in={inProp}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExiting={handleExiting}
      addEndListener={addEndListener}
      // @ts-ignore
      // Wrong typings
      timeout={timeout === 'auto' ? null : timeout}
      {...other}
    >
      {(state: string, childProps: any): React.ReactElement => (
        <Container
          as={Component}
          className={className}
          entered={state === 'entered'}
          hidden={state === 'exited' && !inProp && collapsedHeight === '0px'}
          style={{
            minHeight: collapsedHeight,
            ...style,
          }}
          ref={ref}
          {...childProps}
        >
          <Wrapper ref={wrapperRef}>
            <WrapperInner>{children}</WrapperInner>
          </Wrapper>
        </Container>
      )}
    </Transition>
  );
});
