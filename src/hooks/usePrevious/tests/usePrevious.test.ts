import { renderHook } from '@testing-library/react-hooks';

import { usePrevious } from '../usePrevious';

const setUp = () => renderHook((value: number): number | undefined => usePrevious(value), { initialProps: 0 });

describe('usePrevious', (): void => {
  it('should return undefined on initial render', (): void => {
    const { result } = setUp();

    expect(result.current).toBeUndefined();
  });

  it('should always return previous state after each update', (): void => {
    const { result, rerender } = setUp();

    rerender(2);
    expect(result.current).toBe(0);

    rerender(4);
    expect(result.current).toBe(2);

    rerender(6);
    expect(result.current).toBe(4);
  });
});
