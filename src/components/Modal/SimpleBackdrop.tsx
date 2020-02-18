/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import styled from 'styled-components';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  invisible?: boolean;
}

const Backdrop = styled.div<Props>`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: ${({ invisible }): string => (invisible ? 'transparent' : 'rgba(0, 0, 0, 0.5)')};
  -webkit-tap-highlight-color: transparent;
`;

export const SimpleBackdrop = React.forwardRef(function SimpleBackdrop(props: Props, ref: React.Ref<HTMLDivElement>) {
  const {
    invisible = false,
    open,
    ...other
  } = props;

  return open ? (
    <Backdrop
      aria-hidden
      ref={ref}
      invisible={invisible}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    />
  ) : null;
});
