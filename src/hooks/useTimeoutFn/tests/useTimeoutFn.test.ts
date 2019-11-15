import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks';
import { useTimeoutFn, UseTimeoutFnReturn } from '../useTimeoutFn';

function getHook(
  ms = 5,
  fn: Function = jest.fn(),
): [Function, RenderHookResult<{ delay: number; cb: Function }, UseTimeoutFnReturn>] {
  return [fn, renderHook(({ delay = 5, cb }) => useTimeoutFn(cb, delay), { initialProps: { delay: ms, cb: fn } })];
}

describe('useTimeoutFn', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(useTimeoutFn).toBeDefined();
  });

  it('should return object with three functions', () => {
    const hook = renderHook(() => useTimeoutFn(() => {}, 5));

    expect(typeof hook.result.current.isReady).toBe('function');
    expect(typeof hook.result.current.set).toBe('function');
    expect(typeof hook.result.current.clear).toBe('function');
  });

  it('should call passed function after given amount of time', () => {
    const [spy, hook] = getHook();

    act(() => hook.result.current.set());

    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(5);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should cancel function call on unmount', () => {
    const [spy, hook] = getHook();

    expect(spy).not.toHaveBeenCalled();

    hook.unmount();

    jest.advanceTimersByTime(5);

    expect(spy).not.toHaveBeenCalled();
  });

  it('isReady function should return actual state of timeout', () => {
    let [, hook] = getHook();
    let { isReady, set } = hook.result.current;

    act(() => set());

    expect(isReady()).toBe(false);

    hook.unmount();

    expect(isReady()).toBeNull();

    [, hook] = getHook();

    isReady = hook.result.current.isReady;
    set = hook.result.current.set;

    act(() => set());

    jest.advanceTimersByTime(5);

    expect(isReady()).toBe(true);
  });

  it('clear function should cancel timeout', () => {
    const [spy, hook] = getHook();
    const { isReady, clear, set } = hook.result.current;

    act(() => set());

    expect(spy).not.toHaveBeenCalled();
    expect(isReady()).toBe(false);

    act(() => {
      clear();
    });

    jest.advanceTimersByTime(5);

    expect(spy).not.toHaveBeenCalled();
    expect(isReady()).toBeNull();
  });

  it('should clear timeout on delay change', () => {
    const [spy, hook] = getHook(50);

    act(() => hook.result.current.set());

    expect(spy).not.toHaveBeenCalled();

    hook.rerender({ delay: 5, cb: spy });

    jest.advanceTimersByTime(5);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should NOT clear timeout on function change', () => {
    const [spy, hook] = getHook(50);

    act(() => hook.result.current.set());

    jest.advanceTimersByTime(25);

    expect(spy).not.toHaveBeenCalled();

    const spy2 = jest.fn();
    hook.rerender({ delay: 50, cb: spy2 });

    jest.advanceTimersByTime(25);

    expect(spy).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledTimes(1);
  });
});
