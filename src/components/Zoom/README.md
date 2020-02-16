# `Zoom`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/components-zoom--basic)

Zoom component expand outwards from the center of the child element.

# Example

```jsx
import React from 'react';
import { Zoom } from 'react-essential-tools';

export default function SimpleSlide() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (): void => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <button type="button" onClick={handleChange}>{checked ? 'out' : 'in'}</button>

      <Zoom in={checked}>
        <div>Zoom</div>
      </Zoom>
    </>
  );
}
```
