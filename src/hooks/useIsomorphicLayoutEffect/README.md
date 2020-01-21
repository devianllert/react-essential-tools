# `useIsomorphicLayoutEffect`

`useLayoutEffect` that does not show warning when server-side rendering, see [Alex Reardon's article](https://medium.com/@alexandereardon/uselayouteffect-and-ssr-192986cdcf7a) for more info.

## Example

```jsx
import React from 'react';
import { useIsomorphicLayoutEffect } from 'react-essential-tools';

const Demo = ({ value }) => {
  useIsomorphicLayoutEffect(() => {
    window.console.log(value)
  }, [value]);

  return null;
};
```
