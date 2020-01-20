import * as React from 'react';

import { usePrevious } from '../usePrevious';

export default {
  title: 'Hooks|usePrevious',
};

export const Basic = () => {
  const [count, setCount] = React.useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>
        Now:
        {count}
        ,
        before:
        {String(prevCount)}
      </p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>+</button>
      <button type="button" onClick={() => setCount((value) => value - 1)}>-</button>
    </div>
  );
};
