# `useClickAway`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/hooks-useclickaway--basic)

Hook that triggers a callback when the user clicks outside the target element.

## Example

```jsx
import React from 'react';
import { useClickAway } from 'react-essential-tools';

const Demo = () => {
  const ref = useRef(null);

  useClickAway(ref, () => {
    console.log('clicked');
  });

  return (
    <div ref={ref} style={{
      width: 200,
      height: 200,
      background: 'red',
    }} />
  );
};
```
