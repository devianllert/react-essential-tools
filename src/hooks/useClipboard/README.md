# `useClipboard`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/hooks-useclipboard--basic)

Hook that read and write to the user's clipboard.

## Example

```jsx
import React from 'react';
import { useClipboard } from 'react-essential-tools';

const Demo = () => {
  const [text, setText] = useState('');
  const { clipboardState, setClipboard, readClipboard } = useClipboard();

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />

      <button onClick={() => setClipboard(text)}>copy</button>
      <button onClick={() => readClipboard()}>read</button>

      Clipboard value: {clipboardState}
    </div>
  )
}

```
