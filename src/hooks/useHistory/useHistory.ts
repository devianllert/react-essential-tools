/* eslint-disable no-case-declarations */
import { useReducer, useCallback, Reducer } from 'react';

interface UseHistoryActions<T> {
  set: (payload: T) => void;
  reset: (payload?: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface UseHistoryAction<T> {
  type: string;
  payload?: T;
}

interface UseHistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

const initialState: UseHistoryState<unknown> = {
  past: [],
  present: null,
  future: [],
};

const reducer: Reducer<UseHistoryState<any>, UseHistoryAction<any>> = (state, action) => {
  const { past, present, future } = state;

  switch (action.type) {
    case 'UNDO':
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };

    case 'REDO':
      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };

    case 'SET':
      if (action.payload === present) {
        return state;
      }

      return {
        past: [...past, present],
        present: action.payload,
        future: [],
      };

    case 'RESET':
      return {
        ...initialState,
        present: action.payload,
      };

    default:
      return state;
  }
};

/**
 * Hook that add state history with undo/redo functionality
 */

export const useHistory = <T>(initialPresent: T): [UseHistoryState<T>, UseHistoryActions<T>] => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    present: initialPresent,
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({ type: 'UNDO' });
    }
  }, [canUndo, dispatch]);

  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({ type: 'REDO' });
    }
  }, [canRedo, dispatch]);

  const set = useCallback((payload: T) => dispatch({ type: 'SET', payload }), [dispatch]);

  const reset = useCallback(
    (payload?: T) => dispatch({ type: 'RESET', payload: payload || initialPresent }),
    [dispatch, initialPresent],
  );

  return [
    state,
    {
      set,
      undo,
      redo,
      reset,
      canUndo,
      canRedo,
    },
  ];
};
