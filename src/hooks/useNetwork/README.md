# `useNetwork`

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
