# `useMouse`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/hooks-usemouse--basic)

Hook that re-render on mouse position changes.

## Example

```jsx
import React from 'react';
import { useMouse } from 'react-essential-tools';

const Demo = () => {
  const ref = React.useRef(null);
  const {
    docX,
    docY,
    posX,
    posY,
    elX,
    elY,
    elW,
    elH,
  } = useMouse(ref);

  return (
    <div ref={ref}>
      <div>Mouse position in document - x:{docX} y:{docY}</div>
      <div>Mouse position in element - x:{elX} y:{elY}</div>
      <div>Element position- x:{posX} y:{posY}</div>
      <div>Element dimensions - {elW}x{elH}</div>
    </div>
  );
};
```
