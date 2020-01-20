import * as React from 'react';

import { useSetState } from '../useSetState';

export default {
  title: 'Hooks|useSetState',
};

export const Basic = () => {
  const [state, setState] = useSetState<any>({});

  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button type="button" onClick={() => setState({ hello: 'world' })}>hello</button>
      <button type="button" onClick={() => setState({ foo: 'bar' })}>foo</button>
      <button
        type="button"
        onClick={() => {
          setState((prevState) => ({
            count: prevState.count === undefined ? 0 : prevState.count + 1,
          }));
        }}
      >
        increment
      </button>
    </div>
  );
};
