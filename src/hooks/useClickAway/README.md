# `useClickAway`

Hook that triggers a callback when user clicks outside the target element.

## Example

```jsx
import { useClickAway } from 'react-essential-tools';

const Demo = () => {
  const ref = useRef(null);

  useClickAway(ref, () => {
    console.log('clicked');
  });

  return (
    <div ref={ref} style={{
      width: 200,
      height: 200,
      background: 'red',
    }} />
  );
};
```

To optimize you can wrap handler in useCallback before passing it into this hook.
