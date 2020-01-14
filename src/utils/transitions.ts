import { CSSProperties } from 'react';
import {
  TransitionProps as _TransitionProps,
  TransitionActions,
} from 'react-transition-group/Transition';

export type TransitionHandlerKeys =
  | 'onEnter'
  | 'onEntering'
  | 'onEntered'
  | 'onExit'
  | 'onExiting'
  | 'onExited';

export type TransitionHandlerProps = Pick<_TransitionProps, TransitionHandlerKeys>;

export type TransitionKeys =
  | 'in'
  | 'mountOnEnter'
  | 'unmountOnExit'
  | 'timeout'
  | 'addEndListener'
  | TransitionHandlerKeys;

export interface TransitionProps extends TransitionActions, Partial<Pick<_TransitionProps, TransitionKeys>> {
  style?: CSSProperties;
}

interface Easings {
  easeInOut: string;
  easeOut: string;
  easeIn: string;
  sharp: string;
}

interface Durations {
  shortest: number;
  shorter: number;
  short: number;
  standard: number;
  complex: number;
  enteringScreen: number;
  leavingScreen: number;
}

export const easing: Easings = {
  // This is the most common easing curve.
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Objects enter the screen at full velocity from off-screen and
  // slowly decelerate to a resting point.
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  // The sharp curve is used by objects that may return to the screen at any time.
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
};

export const duration: Durations = {
  shortest: 150,
  shorter: 200,
  short: 250,
  // most basic recommended timing
  standard: 300,
  // this is to be used in complex animations
  complex: 375,
  // recommended when something is entering screen
  enteringScreen: 225,
  // recommended when something is leaving screen
  leavingScreen: 195,
};

export const formatMs = (milliseconds: number): string => `${Math.round(milliseconds)}ms`;

export const reflow = (node: HTMLElement): number => node.scrollTop;

export function getTransitionProps(props: any, options: any): any {
  const { timeout, style = {} } = props;

  return {
    duration: style.transitionDuration || typeof timeout === 'number' ? timeout : timeout[options.mode] || 0,
    delay: style.transitionDelay,
  };
}

export function getAutoHeightDuration(height: number): number {
  if (!height) {
    return 0;
  }

  const constant = height / 36;

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

export function create(
  props: string | string[] = ['all'],
  options: Partial<{ duration: number; easing: string; delay: number }> = {},
): string {
  const { duration: durationOption = duration.standard, easing: easingOption = easing.easeInOut, delay = 0 } = options;

  return (Array.isArray(props) ? props : [props])
    .map((animatedProp) => `${animatedProp} ${
      typeof durationOption === 'string' ? durationOption : formatMs(durationOption)
    } ${easingOption} ${typeof delay === 'string' ? delay : formatMs(delay)}`)
    .join(',');
}

export const getScale = (value: number): string => `scale(${value}, ${value ** 2})`;
