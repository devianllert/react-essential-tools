# `useAsync`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/hooks-useasync--basic)

Hook that resolves an `async` function or a function that returns a promise

## Example

```jsx
import React from 'react';
import { useAsync } from 'react-essential-tools';

const Demo = ({ url }) => {
  const [state] = useAsync(async () => {
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
    </div>
  );
};
```
