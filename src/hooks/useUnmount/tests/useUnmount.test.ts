import { renderHook } from '@testing-library/react-hooks';

import { useUnmount } from '../useUnmount';

describe('useUnmount', () => {
  const mockMount = jest.fn();
  const mockUnmount = jest.fn();
  const mockRerender = jest.fn();

  it('should not call provided callback on mount', () => {
    renderHook(() => useUnmount(mockMount));

    expect(mockMount).not.toHaveBeenCalled();
  });

  it('should call provided callback on unmount', () => {
    const { unmount } = renderHook(() => useUnmount(mockUnmount));
    expect(mockUnmount).not.toHaveBeenCalled();

    unmount();

    expect(mockUnmount).toHaveBeenCalledTimes(1);
  });

  it('should not call provided callback on rerender', () => {
    const { rerender } = renderHook(() => useUnmount(mockRerender));
    expect(mockRerender).not.toHaveBeenCalled();

    rerender();

    expect(mockRerender).not.toHaveBeenCalled();
  });
});
