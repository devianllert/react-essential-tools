# `useSetState`

Hook that creates `setState` method which works similar to how
`this.setState` works in class components. It merges object changes into
current state.

## Example

```jsx
import React from 'react';
import { useSetState } from 'react-essential-tools';

const Demo = () => {
  const [state, setState] = useSetState({});

  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button onClick={() => setState({hello: 'world'})}>hello</button>
      <button onClick={() => setState({foo: 'bar'})}>foo</button>
      <button 
        onClick={() => {
          setState((prevState) => ({
            count: (prevState.count || 0) + 1,
          }))
        }}
      >
        count
      </button>
    </div>
  );
};
```