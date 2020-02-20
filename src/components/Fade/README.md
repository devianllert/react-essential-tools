# `Fade`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/components-fade--basic)

Fade component fade in from transparent to opaque.

# Example

```jsx
import React from 'react';
import { Fade } from 'react-essential-tools';

export default function SimpleFade() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (): void => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <button type="button" onClick={handleChange}>{checked ? 'out' : 'in'}</button>

      <Fade in={checked}>
        <div>Fade</div>
      </Fade>
    </>
  );
}
```
