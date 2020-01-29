# `Slide`

Slide in from the edge of the screen. The `direction` property controls which edge of the screen the transition starts from.

# Example

```jsx
import React from 'react';
import { Slide } from 'react-essential-tools';

export default function SimpleSlide() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (): void => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <button type="button" onClick={handleChange}>{checked ? 'out' : 'in'}</button>

      <Slide in={checked}>
        <div>Slide</div>
      </Slide>
    </>
  );
}
```