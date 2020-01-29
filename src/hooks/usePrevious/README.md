# `usePrevious`

Hook that stores a value and pass it back to the component on each render.
Useful for example to store a prop and compare it to the newest value.

## Example

```jsx
import React from 'react';
import { usePrevious } from 'react-essential-tools';

const Demo = () => {
  const [count, setCount] = React.useState(0);
  const prevCount = usePrevious(count);

  return (
    <p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <p>
        Now: {count}, before: {prevCount}
      </p>
    </p>
  );
};
```
