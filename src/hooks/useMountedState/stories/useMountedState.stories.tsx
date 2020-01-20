import * as React from 'react';

import { useMountedState } from '../useMountedState';

export default {
  title: 'Hooks|useMountedState',
};

export const Basic = () => {
  const isMounted = useMountedState();
  const [, updateState] = React.useState();

  requestAnimationFrame(updateState);

  return (
    <div>
      This component is
      {isMounted() ? 'MOUNTED' : 'NOT MOUNTED'}
    </div>
  );
};
