import { renderHook } from '@testing-library/react-hooks';

import { useMountedState } from '../useMountedState';

describe('useMountedState', (): void => {
  it('should be defined', (): void => {
    expect(useMountedState).toBeDefined();
  });

  it('should return a function', (): void => {
    const { result } = renderHook(() => useMountedState(), { initialProps: false });

    expect(typeof result.current).toEqual('function');
  });

  it('should return true if component is mounted', (): void => {
    const { result } = renderHook(() => useMountedState(), { initialProps: false });

    expect(result.current()).toBeTruthy();
  });

  it('should return false if component is unmounted', (): void => {
    const { result, unmount } = renderHook(() => useMountedState(), { initialProps: false });

    unmount();

    expect(result.current()).toBeFalsy();
  });
});
