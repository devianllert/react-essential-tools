/* eslint-disable @typescript-eslint/no-explicit-any */

const on = (
  target: EventTarget,
  type: string,
  callback: EventListener | EventListenerObject | ((event: any) => void),
  options?: boolean | AddEventListenerOptions,
): void => target.addEventListener(type, callback, options);

const off = (
  target: EventTarget,
  type: string,
  callback: EventListener | EventListenerObject | ((event: any) => void),
  options?: boolean | EventListenerOptions,
): void => target.removeEventListener(type, callback, options);

export {
  on,
  off,
};
