import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks';

import { useAsyncFn, AsyncFn } from '../useAsyncFn';

type Fn<T> = (...args: any[]) => Promise<T>;

const setUp = <T>(
  callback: Fn<T>,
): RenderHookResult<{ fn: Fn<T> }, AsyncFn<T>> => {
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

    const [, callback] = hook.result.current;

    let result: number | Error | undefined;

    await act(async () => {
      result = await callback(5, 7);
    });

    expect(adder).toHaveBeenCalledTimes(1);

    expect(result).toEqual(12);

    const [state] = hook.result.current;

    expect(state.result).toEqual(12);
    expect(result).toEqual(state.result);
  });

  it('resolves a value derived from args', async () => {
    expect.assertions(4);

    const hook = setUp(adder);

    const [, callback] = hook.result.current;

    act(() => {
      callback(2, 7);
    });

    hook.rerender({ fn: adder });
    await hook.waitForNextUpdate();

    const [state] = hook.result.current;

    expect(adder).toHaveBeenCalledTimes(1);

    expect(state.pending).toEqual(false);
    expect(state.error).toBeUndefined();
    expect(state.result).toEqual(9);
  });
});
