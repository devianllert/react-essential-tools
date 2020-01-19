import * as React from 'react';

import { useMotion } from '../useMotion';

export default {
  title: 'Hooks|useMotion',
};

export const Basic = () => {
  const state = useMotion();

  return <pre>{JSON.stringify(state, null, 2)}</pre>;
};
