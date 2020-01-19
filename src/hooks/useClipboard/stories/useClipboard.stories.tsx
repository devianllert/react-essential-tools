import * as React from 'react';

import { useClipboard } from '../useClipboard';

export default {
  title: 'Hooks|useClipboard',
};

export const Basic = () => {
  const [text, setText] = React.useState('');
  const { clipboardState, setClipboard, readClipboard } = useClipboard();

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button type="button" onClick={() => setClipboard(text)}>
        Copy to clipboard
      </button>

      <button type="button" onClick={() => readClipboard()}>
        Read from clipboard
      </button>

      {clipboardState && (
        <>
          <p>
            Copied:
            {clipboardState}
          </p>
          <input type="text" placeholder="Paste it in here to check" />
        </>
      )}
    </div>
  );
};
