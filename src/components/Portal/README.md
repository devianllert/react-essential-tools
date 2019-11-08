# Portal

The portal component renders its children into a new "subtree" outside of current component hierarchy.

The children of the portal component will be appended to the container specified. The component is used internally by the ```Modal``` and ```Popper``` components.

## Server-side

React doesn't support the ```createPortal()``` API on the server. You have to wait for the client-side hydration to see the children.

## Example

```jsx
import React from 'react';
import { Portal } from 'react-essential-tools';

export default function SimplePortal() {
  const [show, setShow] = React.useState(false);
  const container = React.useRef(null);

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        {show ? 'Unmount children' : 'Mount children'}
      </button>
      <div>
        It looks like I will render here.
        {show && (
          <Portal container={container.current}>
            <span>But I actually render here!</span>
          </Portal>
        )}
      </div>
      <div ref={container} />
    </div>
  );
}
```