import * as React from 'react';

import { useMount } from '../useMount';

export default {
  title: 'Hooks|useMount',
};

export const Basic = () => {
  useMount(() => alert('MOUNTED'));

  return (
    <div>
      <code>useMount()</code>
      hook can be used to perform a side-effect when component is mounted.
    </div>
  );
};
