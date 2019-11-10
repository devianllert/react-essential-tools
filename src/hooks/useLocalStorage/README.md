# `useLocalStorage`

Sync state to local storage so that it persists through a page refresh.
Usage is similar to useState except we pass in a local storage key so
that we can default to that value on page load instead of the specified initial value.

## Example

```jsx
import { useLocalStorage } from 'react-essential-tools';

const Demo = () => {
  const [value, setValue] = useLocalStorage('my-key', 'foo');

  return (
    <div>
      <div>Value: {value}</div>
      <button onClick={() => setValue('bar')}>bar</button>
      <button onClick={() => setValue('baz')}>baz</button>
    </div>
  );
};
```
