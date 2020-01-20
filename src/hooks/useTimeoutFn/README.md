# `useTimeoutFn`

Calls given function after specified amount of milliseconds.

Not re-render component;
Automatically clear timeout on unmount;
Automatically clear timeout on delay change;
Reset function call will cancel previous timeout;
Timeout will NOT be clear on function change. It will be called within the timeout,
You have to clear it on your own when needed.

## Example

```jsx
import React from 'react';

import { useTimeoutFn } from 'react-essential-tools';

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
```
