/* eslint-disable prefer-arrow-callback */
import React, {
  Ref,
  AriaAttributes,
  HTMLAttributes,
  CSSProperties,
} from 'react';

import { CircularContainer } from './CircularContainer';
import { CircularSVG } from './CircularSVG';
import { Circle } from './Circle';

const SIZE = 44;

const getRelativeValue = (value: number, min: number, max: number): number => (
  (Math.min(Math.max(min, value), max) - min) / (max - min)
);

const easeOut = (t: number): number => {
  let k = getRelativeValue(t, 0, 1);

  k = (k -= 1) * k * k + 1;

  return k;
};

const easeIn = (t: number): number => t * t;

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  color?: string;
  disableShrink?: boolean;
  size?: number;
  style?: CSSProperties;
  thickness?: number;
  value?: number;
  variant?: 'determinate' | 'indeterminate' | 'stable';
}

export const CircularProgress = React.forwardRef(function CircularProgress(props: Props, ref: Ref<HTMLDivElement>) {
  const {
    className,
    color = 'currentColor',
    disableShrink = false,
    size = 40,
    style,
    thickness = 3.6,
    value = 0,
    variant = 'indeterminate',
    ...other
  } = props;

  const circleStyle: CSSProperties = {};
  const rootStyle: CSSProperties = {};
  const rootProps: AriaAttributes = {};

  if (variant === 'determinate' || variant === 'stable') {
    const circumference = 2 * Math.PI * ((SIZE - thickness) / 2);

    circleStyle.strokeDasharray = circumference.toFixed(3);
    rootProps['aria-valuenow'] = Math.round(value);

    if (variant === 'stable') {
      circleStyle.strokeDashoffset = `${(((100 - value) / 100) * circumference).toFixed(3)}px`;
      rootStyle.transform = 'rotate(-90deg)';
    } else {
      circleStyle.strokeDashoffset = `${(easeIn((100 - value) / 100) * circumference).toFixed(3)}px`;
      rootStyle.transform = `rotate(${(easeOut(value / 70) * 270).toFixed(3)}deg)`;
    }
  }

  return (
    <CircularContainer
      className={className}
      indeterminate={variant === 'indeterminate'}
      stable={variant === 'stable'}
      color={color}
      style={{
        width: size,
        height: size,
        ...rootStyle,
        ...style,
      }}
      ref={ref}
      role="progressbar"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rootProps}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      <CircularSVG viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}>
        <Circle
          indeterminate={variant === 'indeterminate'}
          stable={variant === 'stable'}
          disableShrink={disableShrink}
          style={circleStyle}
          cx={SIZE}
          cy={SIZE}
          r={(SIZE - thickness) / 2}
          fill="none"
          strokeWidth={thickness}
        />
      </CircularSVG>
    </CircularContainer>
  );
});
