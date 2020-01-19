import * as React from 'react';

import { useEvent } from '../useEvent';

export default {
  title: 'Hooks|useEvent',
};

export const Basic = () => {
  const [arr, setArr] = React.useState<string[]>([]);

  const onKeyDown = React.useCallback(({ key }) => {
    if (key === 'r') {
      setArr([]);

      return;
    }

    setArr([...arr, key]);
  }, [arr]);

  useEvent('keydown', onKeyDown);

  return (
    <>
      <p>
        Press some keys on your keyboard,
        <code style={{ color: 'tomato', fontSize: 24, margin: '0 4px' }}>r</code>
        key resets the list
      </p>

      <pre>{JSON.stringify(arr, null, 4)}</pre>
    </>
  );
};
