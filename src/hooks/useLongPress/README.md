# `useLongPress`

Hook that fires a callback after long pressing.

## Usage

```jsx
import { useLongPress } from 'react-use';

const Demo = () => {
  const onLongPress = () => {
    console.log('calls callback after long pressing 300ms');
  };

  const longPressEvent = useLongPress(onLongPress, {
    isPreventDefault: true,
    delay: 300,
  });

  return <button {...longPressEvent}>useLongPress</button>;
};
```
