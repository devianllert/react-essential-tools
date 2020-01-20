# `useHover`

Hook that track if element is being hovered by a mouse.

# Example

```jsx
import * as React from 'react';

import { useHover } from 'react-essential-tools';

const Demo = () => {
  const [hovered, { onMouseEnter, onMouseLeave }] = useHover();

  return (
    <div>
      <div style={{ color: hovered ? 'green' : 'black' }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        Hover me
      </div>

      {hovered ? 'hovered' : 'not hovered'}
    </div>
  );
};
```