import * as React from 'react';

import { useKey } from '../useKey';

export default {
  title: 'Hooks|useKey',
};

export const Basic = () => {
  const [count, setCount] = React.useState(0);

  const increment = React.useCallback(() => setCount((c) => c + 1), []);

  const decrement = React.useCallback(() => setCount((c) => c - 1), []);

  const reset = React.useCallback(() => setCount(0), []);

  useKey('ArrowUp', increment);
  useKey('ArrowDown', decrement);
  useKey('KeyR', reset);

  return (
    <>
      <p>
        Press ArrowUp to increase counter.
      </p>
      <p>
        Press ArrowDown to decrease counter.
      </p>
      <p>
        Press r to reset counter.
      </p>

      {count}
    </>
  );
};
