import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface Props {
  animation?: 'pulse' | 'wave' | false;
  className?: string;
  component?: React.ElementType<any>;
  variant?: 'text' | 'rect' | 'circle';
  height?: number | string;
  width?: number | string;
  style?: React.CSSProperties;
}

const pulse = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`;

const wave = keyframes`
  0% {
    transform: translateX(-100%);
  }

  60% {
    transform: translateX(100%),
  }

  100% {
    transform: translateX(100%);
  }
`;

const SkeletonBox = styled.div<Props>`
  display: block;
  background-color: rgba(0, 0, 0, 0.08);
  height: 1.2em;

  ${({ variant = 'text' }): string => ({
    text: `
      margin-top: 0;
      margin-bottom: 0;
      height: auto;
      transform-origin: 0 60%;
      transform: scale(1, 0.60);
      border-radius: 4px;

      &:empty:before {
        content: "\\00a0";
      }
    `,
    rect: '',
    circle: `
      border-radius: 50%;
    `,
  })[variant]}

  ${({ animation = 'pulse' }) => {
    if (!animation) {
      return '';
    }

    return ({
      pulse: css`
        animation: ${pulse} 1.5s ease-in-out 0.5s infinite;
      `,
      wave: css`
        position: relative;
        overflow: hidden;

        &::after {
          content: "";
          animation: ${wave} 1.6s linear 0.5s infinite;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          top: 0;
          z-index: 1;
        }
      `,
    })[animation];
  }}
`;

export const Skeleton = React.forwardRef((props: Props, ref: React.Ref<HTMLElement>) => {
  const {
    animation = 'pulse',
    className,
    component = 'span',
    height,
    variant = 'text',
    width,
    style,
  } = props;

  return (
    <SkeletonBox
      as={component}
      ref={ref}
      animation={animation}
      variant={variant}
      className={className}
      style={{
        width,
        height,
        ...style,
      }}
    />
  );
});
