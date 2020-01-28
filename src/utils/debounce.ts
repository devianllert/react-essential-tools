// Corresponds to 10 frames at 60 Hz.
// A few bytes payload overhead when lodash/debounce is ~3 kB and debounce ~300 B.
export const debounce = <F extends (...args: any[]) => any>(func: F, wait = 166) => {
  let timeout: number;

  function debounced(this: any, ...args: Parameters<F>): void {
    const later = (): void => {
      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }

  debounced.clear = (): void => {
    clearTimeout(timeout);
  };

  return debounced;
};
