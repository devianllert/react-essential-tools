import * as React from 'react';

import { useNetwork } from '../useNetwork';

export default {
  title: 'Hooks|useNetwork',
};

export const Basic = () => {
  const state = useNetwork();

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
