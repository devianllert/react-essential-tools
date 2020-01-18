import React from 'react';

import { useAsyncFn } from '../useAsyncFn';

export default {
  title: 'useAsyncFn',
};

export const Basic = () => {
  const [state, start] = useAsyncFn<string>(
    () => new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve('OK');
        } else {
          reject(new Error('A random error occurred'));
        }
      }, 1000);
    }),
  );

  return (
    <div>
      {state.pending && <p>Loading...</p>}

      {state.error && (
        <p>
          Error:
          {state.error.message}
        </p>
      )}

      {state.result && (
        <p>
          Value:
          {state.result}
        </p>
      )}

      <button type="button" onClick={start}>Start</button>

      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};
