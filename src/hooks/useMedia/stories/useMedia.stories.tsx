import * as React from 'react';

import { useMedia } from '../useMedia';

export default {
  title: 'Hooks|useMedia',
};

export const Basic = () => {
  const isWide = useMedia('(min-width: 480px)');

  return <div>Screen is wide: {isWide ? 'Yes' : 'No'}</div>;
};
