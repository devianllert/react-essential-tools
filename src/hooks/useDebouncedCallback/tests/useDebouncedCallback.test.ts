import { renderHook, cleanup } from '@testing-library/react-hooks';

import { useDebouncedCallback } from '../useDebouncedCallback';

describe('useDebouncedCallback', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();

    cleanup();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should call callback when timeout is called', () => {
    const callback = jest.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 1000));

    result.current[0]();

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call leading callback immediately', () => {
    const callback = jest.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 1000, { leading: true, trailing: false }));

    result.current[0]();
    result.current[0]();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call leading callback immediately and only once', () => {
    const callback = jest.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 1000, { leading: true, trailing: false }));

    result.current[0]();
    result.current[0]();

    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call leading callback as well as next debounced call', () => {
    const callback = jest.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 1000, { leading: true }));

    result.current[0]();
    result.current[0]();

    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should cancel delayed callback when cancel method is called', () => {
    const callback = jest.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 1000));

    result.current[0]();

    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();

    result.current[1]();

    jest.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should call delayed callback immediatly when callPending method is called', () => {
    const callback = jest.fn();

    const { result } = renderHook(() => useDebouncedCallback(callback, 1000));

    result.current[0]();

    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();

    result.current[2]();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('call callback if maxWait time exceed', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500, { maxWait: 600 }));

    result.current[0]();

    jest.advanceTimersByTime(400);

    result.current[0]();

    jest.advanceTimersByTime(400);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
