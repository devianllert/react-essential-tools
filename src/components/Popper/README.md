# `Popper`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/components-popper--basic)

A Popper can be used to display some content on top of another.

## Example

```jsx
import React from 'react';
import { Popper } from 'react-essential-tools';

export default function SimplePopper() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div>
      <button aria-describedby={id} type="button" onClick={handleClick}>
        Toggle Popper
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <div>The content of the Popper.</div>
      </Popper>
    </div>
  );
}
```
