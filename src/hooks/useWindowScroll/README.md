# `useWindowScroll`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/hooks-usewindowscroll--basic)

Hook that re-renders on window scroll.

## Example

```jsx
import React from 'react';
import { useWindowScroll } from 'react-essential-tools';

const Demo = () => {
  const {x, y} = useWindowScroll();

  return (
    <div>
      <div>x: {x}</div>
      <div>y: {y}</div>
    </div>
  );
};
```
