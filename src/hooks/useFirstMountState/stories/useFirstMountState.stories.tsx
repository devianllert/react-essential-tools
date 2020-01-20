import * as React from 'react';

import { useFirstMountState } from '../useFirstMountState';

export default {
  title: 'Hooks|useFirstMountState',
};

export const Basic = () => {
  const [state, setState] = React.useState(0);
  const update = React.useCallback(() => setState(state + 1), [state]);

  const isFirstMount = useFirstMountState();

  return (
    <div>
      <span>
        This component is just mounted:
        {isFirstMount ? 'YES' : 'NO'}
      </span>
      <br />
      <button type="button" onClick={update}>re-render</button>
    </div>
  );
};
