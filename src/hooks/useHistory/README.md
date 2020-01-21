# `useHistory`

Hook that add state history with undo/redo functionality

## Example

```jsx
import React from 'react';
import { useHistory } from 'react-essential-tools';

const Demo = () => {
  const [
    countState,
    {
      set: setCount,
      reset: resetCount,
      undo: undoCount,
      redo: redoCount,
      canUndo,
      canRedo,
    },
  ] = useHistory(0);
  const { present: presentCount } = countState;

  return (
    <div>
      <p>You clicked {presentCount} times</p>
      <button onClick={() => setCount(presentCount + 1)}>
        +
      </button>
      <button onClick={() => setCount(presentCount - 1)}>
        -
      </button>
      <button onClick={undoCount} disabled={!canUndo}>
        undo
      </button>
      <button onClick={redoCount} disabled={!canRedo}>
        redo
      </button>
      <button onClick={() => resetCount()}>
        reset to initial state
      </button>
    </div>
  );
};
```
