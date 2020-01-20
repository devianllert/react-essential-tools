import * as React from 'react';
import { action } from '@storybook/addon-actions';

import { useClickAway } from '../useClickAway';

export default {
  title: 'Hooks|useClickAway',
};

export const Basic = () => {
  const ref = React.useRef(null);
  useClickAway(ref, action('outside clicked'));

  return (
    <div
      ref={ref}
      style={{
        width: 200,
        height: 200,
        background: 'red',
      }}
    />
  );
};
