import { renderHook } from '@testing-library/react-hooks';

import { useInterval } from '../useInterval';

jest.useFakeTimers();

describe('useInterval', (): void => {
  it('should return undefined on initial render', (): void => {
    const handler = jest.fn();

    renderHook((): void => useInterval(handler, 1000));

    expect(handler).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(5000);

    expect(handler).toHaveBeenCalledTimes(5);
  });

  test('if you pass a new `handler`, the timer will not restart ', (): void => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    let handler = handler1;

    const { rerender } = renderHook(({ fn, time }): void => useInterval(fn, time), {
      initialProps: { fn: handler, time: 1000 },
    });

    jest.advanceTimersByTime(500);

    handler = handler2;

    rerender({ fn: handler, time: 1000 });

    jest.advanceTimersByTime(500);

    expect(handler1).toHaveBeenCalledTimes(0);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  test('if you pass a `delay` of `null`, the timer is "paused"', (): void => {
    const handler = jest.fn();

    renderHook(({ fn, time }): void => useInterval(fn, time), {
      initialProps: { fn: handler, time: null },
    });

    jest.advanceTimersByTime(5000);

    expect(handler).toHaveBeenCalledTimes(0);
  });

  test('if you pass a new `delay`, it will cancel the current timer and start a new one', (): void => {
    const handler = jest.fn();

    let delay = 500;

    const { rerender } = renderHook(({ fn, time }): void => useInterval(fn, time), {
      initialProps: { fn: handler, time: delay },
    });

    jest.advanceTimersByTime(1000);
    expect(handler).toHaveBeenCalledTimes(2);

    delay = 1000;

    rerender({ fn: handler, time: delay });

    jest.advanceTimersByTime(5000);
    expect(handler).toHaveBeenCalledTimes(7);
  });

  test('passing the same parameters causes no change in the timer', (): void => {
    const handler = jest.fn();

    const { rerender } = renderHook((): void => useInterval(handler, 1000));

    jest.advanceTimersByTime(500);

    rerender();

    jest.advanceTimersByTime(500);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
