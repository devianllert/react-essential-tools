/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useRef } from 'react';

interface UseLongPressOptions {
  isPreventDefault?: boolean;
  delay?: number;
}

interface UseLongPressState {
  onMouseDown: (e: any) => void;
  onTouchStart: (e: any) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchEnd: () => void;
}

const isTouchEvent = (event: Event): event is TouchEvent => 'touches' in event;

const preventDefault = (event: Event): void => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

export const useLongPress = (
  callback: (event: TouchEvent | MouseEvent) => void,
  options: UseLongPressOptions = {},
): UseLongPressState => {
  const { isPreventDefault = true, delay = 300 } = options;

  const timeout = useRef<number>();
  const target = useRef<EventTarget>();

  const start = useCallback((event: TouchEvent | MouseEvent) => {
    if (isPreventDefault && event.target) {
      event.target.addEventListener('touchend', preventDefault, { passive: false });
      target.current = event.target;
    }

    timeout.current = setTimeout(() => callback(event), delay);
  }, [callback, delay]);

  const clear = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);

    if (isPreventDefault && target.current) {
      target.current.removeEventListener('touchend', preventDefault);
    }
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
  };
};
