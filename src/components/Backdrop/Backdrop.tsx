/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import styled from 'styled-components';

import { TransitionProps } from '../../utils/transitions';

import { Fade } from '../Fade';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * If `true`, the backdrop is open.
   */
  open: boolean;
  /**
   * If `true`, the backdrop is invisible.
   * It can be used when rendering a popover or a custom select component.
   */
  invisible?: boolean;
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   */
  transitionDuration?: TransitionProps['timeout'];
}

const BaseBackdrop = styled.div<{ invisible: boolean }>`
  z-index: -1;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: ${({ invisible }): string => (invisible ? 'transparent' : 'rgba(0, 0, 0, 0.5)')};
  -webkit-tap-highlight-color: transparent;
`;

export const Backdrop = React.forwardRef(function Backdrop(props: Props, ref: React.Ref<HTMLDivElement>) {
  const {
    children,
    open,
    invisible = false,
    transitionDuration,
    ...other
  } = props;

  return (
    <Fade
      in={open}
      timeout={transitionDuration}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      <BaseBackdrop
        aria-hidden
        ref={ref}
        invisible={invisible}
        className={other.className}
      >
        {children}
      </BaseBackdrop>
    </Fade>
  );
});
