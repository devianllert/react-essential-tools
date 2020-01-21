import { useState, useEffect, RefObject } from 'react';

export interface UseIntersectionState {
  inView: boolean;
  entry?: IntersectionObserverEntry;
}

export interface UseIntersectionOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

/**
 * Hook to track the visibility of a functional component based on IntersectionVisible Observer.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */

export const useIntersection = (
  ref: RefObject<HTMLElement>,
  options: UseIntersectionOptions,
): UseIntersectionState => {
  const [state, setState] = useState<UseIntersectionState>({
    inView: false,
    entry: undefined,
  });

  useEffect(() => {
    const element = ref.current;

    const observer = new IntersectionObserver(
      ([entry]): void => {
        setState({
          inView: entry.isIntersecting,
          entry,
        });
      },
      options,
    );

    if (element) {
      observer.observe(element);
    }

    return (): void => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, options]);

  return state;
};
