import {
  useState,
  useEffect,
  useRef,
  RefObject,
} from 'react';

import { on, off } from '../../utils/listeners';

export interface MousePosition {
  docX: number;
  docY: number;
  posX: number;
  posY: number;
  elX: number;
  elY: number;
  elHeight: number;
  elWidth: number;
}

/**
 * Hook that re-render on mouse position changes.
 */

export const useMouse = (ref: RefObject<Element>): MousePosition => {
  const frame = useRef(0);
  const [position, setPosition] = useState<MousePosition>({
    docX: 0,
    docY: 0,
    posX: 0,
    posY: 0,
    elX: 0,
    elY: 0,
    elHeight: 0,
    elWidth: 0,
  });

  useEffect(() => {
    const moveHandler = (event: MouseEvent): void => {
      cancelAnimationFrame(frame.current);

      frame.current = requestAnimationFrame((): void => {
        if (ref && ref.current) {
          const {
            left,
            top,
            width: elWidth,
            height: elHeight,
          } = ref.current.getBoundingClientRect();

          const posX = left + window.pageXOffset;
          const posY = top + window.pageYOffset;
          const elX = event.pageX - posX;
          const elY = event.pageY - posY;

          setPosition({
            docX: event.pageX,
            docY: event.pageY,
            posX,
            posY,
            elX,
            elY,
            elHeight,
            elWidth,
          });
        }
      });
    };

    on(document, 'mousemove', moveHandler);

    return (): void => {
      cancelAnimationFrame(frame.current);

      off(document, 'mousemove', moveHandler);
    };
  }, [ref]);

  return position;
};
