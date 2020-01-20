import * as React from 'react';

import { useTimeoutFn } from '../useTimeoutFn';

export default {
  title: 'Hooks|useTimeoutFn',
};

export const Basic = () => {
  const [state, setState] = React.useState('Not started');

  function fn() {
    setState(`called at ${Date.now()}`);
  }

  const { isReady, clear, start } = useTimeoutFn(fn, 5000);

  const cancelButtonClick = React.useCallback(() => {
    if (isReady() === false) {
      clear();
      setState('cancelled');
    } else {
      start();
      setState('Not called yet');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const readyState = isReady();

  return (
    <div>
      <div>{readyState === false && 'Function will be called in 5 seconds'}</div>
      <div>{readyState === null && 'Timer not started or cancelled'}</div>
      <div>{readyState === true && 'Timer ready'}</div>

      <button type="button" onClick={cancelButtonClick}>
        {readyState === false && 'cancel '}
        {(readyState === null || readyState === true) && 'start '}
        timeout
      </button>
      <br />
      <div>
        Function state:
        {readyState === false && 'Pending'}
        {readyState === true && 'Called'}
        {readyState === null && 'Not started or cancelled'}
      </div>
      <div>{state}</div>
    </div>
  );
};
