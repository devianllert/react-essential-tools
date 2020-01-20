import * as React from 'react';

import { useUnmount } from '../useUnmount';

export default {
  title: 'Hooks|useUnmount',
};

export const Basic = () => {
  useUnmount(() => alert('UNMOUNTED'));

  return (
    <div>
      <code>useUnmount()</code>
      hook can be used to perform side-effects when component unmounts. This component will
      alert you when it is un-mounted.
    </div>
  );
};
