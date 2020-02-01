import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

interface UseIntersectionState {
  inView: boolean;
  entry?: IntersectionObserverEntry;
}

interface UseIntersectionOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

type UseIntersectionReturn = [(node: Element) => void, UseIntersectionState];

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
};

/**
 * Hook to track the visibility of a functional component based on IntersectionVisible Observer.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */

export const useIntersection = (options: UseIntersectionOptions = defaultOptions): UseIntersectionReturn => {
  const element = useRef<Element>();
  const [state, setState] = useState<UseIntersectionState>({
    inView: false,
    entry: undefined,
  });

  const callbackRef = useCallback((node: Element) => {
    element.current = node;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]): void => {
      setState({
        inView: entry.isIntersecting,
        entry,
      });

      if (entry.isIntersecting && options.triggerOnce) {
        observer.unobserve(entry.target);
      }
    }, options);

    if (element.current) {
      observer.observe(element.current);
    }

    return (): void => {
      if (element.current) {
        observer.unobserve(element.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.root, options.rootMargin, options.threshold, options.triggerOnce]);

  return [callbackRef, state];
};
