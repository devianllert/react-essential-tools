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
import { useTimeoutFn } from 'react-essential-tools';

const Demo = () => {
  const [state, setState] = React.useState('Not called yet');

  function fn() {
    setState(`called at ${Date.now()}`);
  }

  const [isReady, cancel, reset] = useTimeoutFn(fn, 5000);
  const cancelButtonClick = useCallback(() => {
    if (isReady() === false) {
      cancel();
      setState(`cancelled`);
    } else {
      reset();
      setState('Not called yet');
    }
  }, []);

  const readyState = isReady();

  return (
    <div>
      <div>{readyState !== null ? 'Function will be called in 5 seconds' : 'Timer cancelled'}</div>
      <button onClick={cancelButtonClick}>{readyState === false ? 'cancel' : 'restart'} timeout</button>
      <br />
      <div>Function state: {readyState === false ? 'Pending' : readyState ? 'Called' : 'Cancelled'}</div>
      <div>{state}</div>
    </div>
  );
};
```
