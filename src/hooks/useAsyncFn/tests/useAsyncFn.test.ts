import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks';

import { useAsyncFn, AsyncFn } from '../useAsyncFn';

type Fn<T> = (...args: any[]) => Promise<T>;

const setUp = <T>(callback: Fn<T>): RenderHookResult<{ fn: Fn<T> }, AsyncFn<T>> => {
  const initialProps = { fn: callback };

  return renderHook(({ fn }): AsyncFn<T> => useAsyncFn(fn), { initialProps });
};

describe('useAsyncFn', () => {
  let adder: (a: number, b: number) => Promise<number>;

  beforeEach(() => {
    adder = jest.fn(async (a, b): Promise<number> => a + b);
  });

  it('should be defined', () => {
    expect(useAsyncFn).toBeDefined();
  });

  it('initially does not have a value', () => {
    const hook = setUp(adder);

    const [state] = hook.result.current;

    expect(adder).toHaveBeenCalledTimes(0);

    expect(state.result).toBeUndefined();
    expect(state.pending).toEqual(false);
    expect(state.error).toBeUndefined();
  });

  it('callback can be awaited and return the value', async () => {
    expect.assertions(4);

    const hook = setUp(adder);

    const [, { start }] = hook.result.current;

    let result: number | Error | undefined;

    await act(async () => {
      result = await start(5, 7);
    });

    const [state] = hook.result.current;

    expect(adder).toHaveBeenCalledTimes(1);
    expect(result).toEqual(12);
    expect(state.result).toEqual(12);
    expect(result).toEqual(state.result);
  });

  it('should resolve a value derived from args', async () => {
    expect.assertions(4);

    const hook = setUp(adder);

    const [, { start }] = hook.result.current;

    act(() => {
      start(2, 7);
    });

    hook.rerender({ fn: adder });
    await hook.waitForNextUpdate();

    const [state] = hook.result.current;

    expect(adder).toHaveBeenCalledTimes(1);

    expect(state.pending).toEqual(false);
    expect(state.error).toBeUndefined();
    expect(state.result).toEqual(9);
  });

  it('should cancel last call', async () => {
    expect.assertions(4);

    const hook = setUp(adder);

    const [, { start, cancel }] = hook.result.current;

    act(() => {
      start(2, 7);
    });

    act(() => {
      cancel();
    });

    const [state] = hook.result.current;

    expect(adder).toHaveBeenCalledTimes(1);

    expect(state.pending).toEqual(false);
    expect(state.error).toBeUndefined();
    expect(state.result).toBeUndefined();
  });

  it('should only consider last call and discard previous ones', async () => {
    const queuedPromises: { id: number; resolve: () => void }[] = [];
    const delayedFunction1 = () => new Promise((resolve) => queuedPromises.push({ id: 1, resolve: () => resolve(1) }));
    const delayedFunction2 = () => new Promise((resolve) => queuedPromises.push({ id: 2, resolve: () => resolve(2) }));

    const hook = renderHook(({ fn }) => useAsyncFn(fn, [fn]), {
      initialProps: { fn: delayedFunction1 },
    });

    act(() => {
      hook.result.current[1].start(); // invoke 1st callback
    });

    hook.rerender({ fn: delayedFunction2 });
    act(() => {
      hook.result.current[1].start(); // invoke 2nd callback
    });

    act(() => {
      queuedPromises[1].resolve();
      queuedPromises[0].resolve();
    });

    await hook.waitForNextUpdate();
    expect(hook.result.current[0]).toEqual({ pending: false, result: 2 });
  });
});
