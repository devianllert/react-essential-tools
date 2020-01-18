import * as React from 'react';
import { number, withKnobs } from '@storybook/addon-knobs';

import { useAsync } from '../useAsync';

export default {
  title: 'useAsync',
  decorators: [withKnobs],
};

const Demo = ({ delay }: { delay: number }) => {
  const [state, { start, cancel }] = useAsync<string>(
    () => new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve('✌️');
        } else {
          reject(new Error('A pseudo random error occurred'));
        }
      }, delay);
    }),
    [delay],
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

      <button type="button" onClick={start}>Retry</button>
      <button type="button" onClick={cancel}>Cancel</button>

      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
};

export const Basic = () => {
  const delay = number('delay', 1000, {
    range: true,
    min: 100,
    max: 5000,
    step: 100,
  });

  return <Demo delay={delay} />;
};
