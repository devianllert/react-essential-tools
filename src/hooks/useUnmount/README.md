# `useUnmount`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/hooks-useunmount--basic)

Hook that calls a function after the component is unmounted.

## Example

```jsx
import React from 'react';
import { useUnmount } from 'react-essential-tools';

const Demo = () => {
  useUnmount(() => alert('UNMOUNTED'));

  return null;
};
```
