import * as React from 'react';

import { useBoolean } from '../useBoolean';

export default {
  title: 'Hooks|useBoolean',
};

export const Basic = () => {
  const [on, toggle] = useBoolean(true);

  return (
    <div>
      <div>{on ? 'ON' : 'OFF'}</div>
      <button type="button" onClick={(): void => toggle()}>
        Toggle
      </button>
      <button type="button" onClick={(): void => toggle(true)}>
        set ON
      </button>
      <button type="button" onClick={(): void => toggle(false)}>
        set OFF
      </button>
    </div>
  );
};
