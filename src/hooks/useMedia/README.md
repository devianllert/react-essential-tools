# `useMedia`

Hook that tracks state of a CSS media query.

## Example

```jsx
import { useMedia } from 'react-essential-tools';

const Demo = () => {
  const isWide = useMedia('(min-width: 480px)');

  return (
    <div>
      Screen is wide: {isWide ? 'Yes' : 'No'}
    </div>
  );
};
```