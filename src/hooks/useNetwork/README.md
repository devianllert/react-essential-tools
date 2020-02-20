# `useNetwork`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/hooks-usenetwork--basic)

Hook that returns network information

## Example

```jsx
import React from 'react';
import { useNetwork } from 'react-essential-tools';

const Demo = () => {
  const networkState = useNetwork();

  return (
    <div>{JSON.stringify(networkState)}</div>
  );
};
```
