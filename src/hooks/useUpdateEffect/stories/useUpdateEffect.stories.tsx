import * as React from 'react';

import { useUpdateEffect } from '../useUpdateEffect';

export default {
  title: 'Hooks|useUpdateEffect',
};

export const Basic = () => {
  const [count, setCount] = React.useState(0);
  const [didUpdate, setDidUpdate] = React.useState(false);

  useUpdateEffect(() => {
    setDidUpdate(true);
  }, [count]);

  return (
    <div>
      <button type="button" onClick={() => setCount((currentCount) => currentCount + 1)}>
        Count:
        {count}
      </button>
      <p>
        Updated:
        {didUpdate ? 'updated' : 'not updated yet' }
      </p>
    </div>
  );
};
