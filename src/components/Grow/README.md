# `Grow`

Grow component expand outwards from the center of the child element, while also fading in from transparent to opaque.

# Example

```jsx
import React from 'react';
import { Grow } from 'react-essential-tools';

export default function SimpleGrow() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (): void => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <button type="button" onClick={handleChange}>{checked ? 'out' : 'in'}</button>

      <Grow in={checked} style={{ transformOrigin: '0 0 0' }}>
        <div>Grow</div>
      </Grow>
    </>
  );
}
```