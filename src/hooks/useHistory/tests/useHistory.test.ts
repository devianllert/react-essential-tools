import { act, renderHook } from '@testing-library/react-hooks';

import { useHistory } from '../useHistory';

const setUp = (initialValue: number[]) => renderHook(() => useHistory(initialValue));

describe('useHistory', () => {
  const state = [1];

  it('should be defined', () => {
    expect(useHistory).toBeDefined();
  });

  it('should have initial state', () => {
    const { result } = setUp(state);

    expect(result.current[0].present).toEqual([1]);
    expect(result.current[0].past).toEqual([]);
    expect(result.current[0].future).toEqual([]);

    expect(result.current[1].canRedo).toBe(false);
    expect(result.current[1].canUndo).toBe(false);
  });

  it('should set state', () => {
    const { result } = setUp(state);

    act(() => result.current[1].set([1, 2]));

    expect(result.current[0].present).toEqual([1, 2]);
    expect(result.current[0].past).toEqual([[1]]);
    expect(result.current[0].future).toEqual([]);

    expect(result.current[1].canRedo).toBe(false);
    expect(result.current[1].canUndo).toBe(true);
  });

  it('should undo state', () => {
    const { result } = setUp(state);

    act(() => result.current[1].set([1, 2]));
    act(() => result.current[1].undo());

    expect(result.current[0].present).toEqual([1]);
    expect(result.current[0].past).toEqual([]);
    expect(result.current[0].future).toEqual([[1, 2]]);

    expect(result.current[1].canRedo).toBe(true);
    expect(result.current[1].canUndo).toBe(false);
  });

  it('should redo state', () => {
    const { result } = setUp(state);

    act(() => result.current[1].set([1, 2]));
    act(() => result.current[1].undo());
    act(() => result.current[1].redo());

    expect(result.current[0].present).toEqual([1, 2]);
    expect(result.current[0].past).toEqual([[1]]);
    expect(result.current[0].future).toEqual([]);

    expect(result.current[1].canRedo).toBe(false);
    expect(result.current[1].canUndo).toBe(true);
  });

  it('should reset to initial state if no args', () => {
    const { result } = setUp(state);

    act(() => result.current[1].set([1, 2]));
    act(() => result.current[1].reset());

    expect(result.current[0].present).toEqual([1]);
    expect(result.current[0].past).toEqual([]);
    expect(result.current[0].future).toEqual([]);

    expect(result.current[1].canRedo).toBe(false);
    expect(result.current[1].canUndo).toBe(false);
  });

  it('should reset to payload state', () => {
    const { result } = setUp(state);

    act(() => result.current[1].set([1, 2]));
    act(() => result.current[1].reset([1, 2, 3]));

    expect(result.current[0].present).toEqual([1, 2, 3]);
    expect(result.current[0].past).toEqual([]);
    expect(result.current[0].future).toEqual([]);

    expect(result.current[1].canRedo).toBe(false);
    expect(result.current[1].canUndo).toBe(false);
  });

  it('should not set state if argruments equal with present state', () => {
    const { result } = setUp(state);

    act(() => result.current[1].set(state));

    expect(result.current[0].present).toEqual([1]);
    expect(result.current[0].past).toEqual([]);
    expect(result.current[0].future).toEqual([]);

    expect(result.current[1].canRedo).toBe(false);
    expect(result.current[1].canUndo).toBe(false);
  });
});
