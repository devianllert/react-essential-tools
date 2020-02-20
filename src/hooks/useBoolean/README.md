# `useBoolean`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/hooks-useboolean--basic)

Hook that tracks value of a boolean.

## Example

```jsx
import React from 'react';
import { useBoolean } from 'react-essential-tools';

const Demo = () => {
  const [on, toggle] = useBoolean(true);

  return (
    <div>
      <div>{on ? 'ON' : 'OFF'}</div>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => toggle(true)}>set ON</button>
      <button onClick={() => toggle(false)}>set OFF</button>
    </div>
  );
};
```
