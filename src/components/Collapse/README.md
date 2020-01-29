# `Collapse`

Collapse component expand vertically from the top of the child element. The collapsedHeight property can be used to set the minimum height when not expanded.

# Example

```jsx
import React from 'react';
import { Collapse } from 'react-essential-tools';

export const SimpleCollapse = (): ReactElement => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (): void => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <button type="button" onClick={handleChange}>{checked ? 'out' : 'in'}</button>

      <Collapse in={checked}>
        <Block>Collapse</Block>
      </Collapse>
    </>
  );
};
```