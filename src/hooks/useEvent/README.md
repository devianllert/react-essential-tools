# `useEvent`

Hook that subscribes a `handler` to events.

## Example

```jsx
import React from 'react';
import { useEvent, useBoolean } from 'react-essential-tools';

const Demo = () => {
  const [on, toggle] = useBoolean(false);

  const onKeyDown = useCallback(({ key }) => {
    if (key === 'y') toggle(true);
    if (key === 'n') toggle(false);
  }, []);

  useEvent('keydown', onKeyDown);

  return (
    <div>
      {on ? 'ON' : 'OFF'}
    </div>
  );
};
```
