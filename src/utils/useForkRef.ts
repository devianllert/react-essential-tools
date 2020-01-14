import * as React from 'react';
import { setRef } from './setRef';

export const useForkRef = <T>(refA: React.Ref<T>, refB: React.Ref<T>): React.Ref<T> => React.useMemo(() => {
  if (refA == null && refB == null) {
    return null;
  }

  return (refValue): void => {
    setRef(refA, refValue);
    setRef(refB, refValue);
  };
}, [refA, refB]);
