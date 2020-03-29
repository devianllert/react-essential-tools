import * as React from 'react';

import { useHistory } from '../useHistory';

export default {
  title: 'Hooks|useHistory',
};

export const Basic = () => {
  const [
    state,
    {
      set: setDirection,
      reset,
      undo,
      redo,
      canUndo,
      canRedo,
    },
  ] = useHistory(0);

  return (
    <div>
      <div>
        Present:
        {state.present}
      </div>
      <div>
        Past:
        {state.past[state.past.length - 1]}
      </div>
      <div>
        Future:
        {state.future[state.future.length - 1]}
      </div>

      <button type="button" onClick={(): void => setDirection(state.present + 1)}>+</button>
      <button type="button" onClick={(): void => setDirection(state.present - 1)}>-</button>

      <button type="button" onClick={undo} disabled={!canUndo}>Undo</button>
      <button type="button" onClick={redo} disabled={!canRedo}>Redo</button>
      <button type="button" onClick={(): void => reset()}>Reset</button>

      <div>
        Past:
        {JSON.stringify(state.past, null, 2)}
      </div>
      <div>
        Future:
        {JSON.stringify(state.future, null, 2)}
      </div>
    </div>
  );
};
