import { useState, useEffect, RefObject } from 'react';

/**
 * Hook to track the visibility of a functional component based on IntersectionVisible Observer.
 */

export const useIntersection = (
  ref: RefObject<HTMLElement>,
  options: IntersectionObserverInit,
): IntersectionObserverEntry | null => {
  const [intersectionObserverEntry, setIntersectionObserverEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = ref.current;

    const observer = new IntersectionObserver(
      ([entry]): void => {
        setIntersectionObserverEntry(entry);
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

  return intersectionObserverEntry;
};
