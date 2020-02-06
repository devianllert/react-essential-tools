# `useDebouncedCallback`

Hook that delays invoking a function until after wait milliseconds have elapsed since the last time the debounced function was invoked.

# Example

```jsx
import React from 'react';
import { useDebouncedCallback } from 'react-essential-tools';

const Demo = () => {
  const [state, setState] = React.useState('Typing stopped');
  const [val, setVal] = React.useState('');
  const [debouncedValue, setDebouncedValue] = React.useState('');

  const [onChange, cancel] = useDebouncedCallback(() => {
    setState('Typing stopped');
    setDebouncedValue(val);
  }, 2000);

  const cancelCallback = (): void => {
    setState('Cancelled');
    cancel();
  };

  return (
    <div>
      <input
        type="text"
        value={val}
        placeholder="Debounced input"
        onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
          setState('Waiting for typing to stop...');
          setVal(event.currentTarget.value);

          onChange();
        }}
      />
      <div>{state}</div>
      <div>
        Debounced value:
        {debouncedValue}
        <button type="button" onClick={cancelCallback}>
          Cancel debounce
        </button>
      </div>
    </div>
  );
};
```