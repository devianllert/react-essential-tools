# `useAsyncFn`

Hook that returns state and a callback for an `async` function or a function that returns a promise. The state is of the same shape as `useAsync`.

## Example

```jsx
import { useAsyncFn } from 'react-essential-tools';

const Demo = ({ url }) => {
  const [state, { start, cancel }] = useAsyncFn(async () => {
    const response = await fetch(url);
    const result = await response.text();

    return result
  }, [url]);

  return (
    <div>
      {state.pending && <div>Loading...</div>}

      {(state.error && !state.pending) && (
        <div>
          Error:
          {state.error.message}
        </div>
      )}

      {(state.result && !state.pending) && <div>{state.result}</div>}

      <button onClick={start}>Start loading</button>
      <button onClick={cancel}>Cancel loading</button>
    </div>
  );
};
```
