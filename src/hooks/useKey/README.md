# `useKey`

Hook that executes a `handler` when a keyboard key is used.

## Example

```jsx
import React from 'react';
import { useKey } from 'react-essential-tools';

const Demo = () => {
  const [count, set] = useState(0);
  const increment = () => set(count => ++count);
  useKey('ArrowUp', increment);

  return (
    <div>
      Press arrow up: {count}
    </div>
  );
};
```

```jsx
import { useKey } from 'react-essential-tools';

const Demo = () => {
  const [count, set] = useState(0);
  const increment = () => set(count => ++count);
  
  const predicate = (event) => event.key === 'i'
  useKey(predicate, increment, { event: 'keyup' });

  return (
    <div>
      Press arrow up: {count}
    </div>
  );
};

```