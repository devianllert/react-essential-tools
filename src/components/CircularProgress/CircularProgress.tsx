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

interface Props extends HTMLAttributes<HTMLDivElement> {
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color?: string;
  /**
   * If `true`, the shrink animation is disabled.
   * This only works if variant is `indeterminate`.
   */
  disableShrink?: boolean;
  /**
   * The size of the circle.
   * If using a number, the pixel unit is assumed.
   * If using a string, you need to provide the CSS unit, e.g '3rem'.
   */
  size?: number;
  /**
   * The thickness of the circle.
   */
  thickness?: number;
  /**
   * The value of the progress indicator for the determinate and static variants.
   * Value between 0 and 100.
   */
  value?: number;
  /**
   * The variant to use.
   * Use indeterminate when there is no progress value.
   */
  variant?: 'determinate' | 'indeterminate' | 'stable';
}

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

/**
 * If the progress bar is describing the loading progress of a particular region of a page,
 * you should use `aria-describedby` to point to the progress bar, and set the `aria-busy`
 * attribute to `true` on that region until it has finished loading.
 */
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
