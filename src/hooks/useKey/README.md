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
import React from 'react';
import { useKey } from 'react-essential-tools';

const Demo = () => {
  const [count, set] = useState(0);
  const increment = () => set(count => ++count);
  useKey(['ArrowUp', '+'], increment, { event: 'keyup' });

  return (
    <div>
      Press arrow up or +: {count}
    </div>
  );
};
```
