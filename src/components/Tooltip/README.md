# `Tooltip`

Tooltips display informative text when users hover over, focus on, or tap an element.

## Example

```jsx
import React from 'react';
import { Tooltip } from 'react-essential-tools';

export default function SimpleTooltip() {
  return (
    <Tooltip title="tooltip">
      <span>Text with tooltip</span>
    </Tooltip>
  );
}
```

## Custom child element

The tooltip needs to apply DOM event listeners to its child element. If the child is a custom React element, you need to make sure that it spreads its properties to the underlying DOM element.

```jsx
function MyComponent(props) {
  //  Spread the properties to the underlying DOM element.
  return <div {...props}>Bin</div>
}

// ...

<Tooltip title="tooltip">
  <MyComponent />
</Tooltip>
```