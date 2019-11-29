import { useState, useEffect } from 'react';

import { on, off } from '../../utils/listeners';

export interface UseMotionState {
  acceleration: DeviceMotionEventAcceleration;
  accelerationIncludingGravity: DeviceMotionEventAcceleration;
  rotationRate: DeviceMotionEventRotationRate;
  interval: number;
}

const defaultState: UseMotionState = {
  acceleration: {
    x: null,
    y: null,
    z: null,
  },
  accelerationIncludingGravity: {
    x: null,
    y: null,
    z: null,
  },
  rotationRate: {
    alpha: null,
    beta: null,
    gamma: null,
  },
  interval: 16,
};

/**
 * Hook that uses device's acceleration sensor to track its motions.
 */

export const useMotion = (initialState: UseMotionState = defaultState): UseMotionState => {
  const [state, setState] = useState(initialState);

  useEffect((): (() => void) => {
    const handler = (event: UseMotionState): void => {
      const {
        acceleration,
        accelerationIncludingGravity,
        rotationRate,
        interval,
      } = event;

      setState({
        acceleration,
        accelerationIncludingGravity,
        rotationRate,
        interval,
      });
    };

    on(window, 'devicemotion', handler);

    return (): void => {
      off(window, 'devicemotion', handler);
    };
  }, []);

  return state;
};
