import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Tooltip, useLocalStorage, useClipboard } from '../src';

const App = () => {
  const [ver, setVer] = useLocalStorage('version', '0.1');
  const { clipboardState, setClipboard, readClipboard } = useClipboard();

  return (
    <div>
      <input type="text" value={ver} onChange={(evt) => setVer(evt.target.value)}/>

      <Tooltip title="Copy input text" arrow>
        <button onClick={() => setClipboard(ver.toString())}>copy</button>
      </Tooltip>

      <Tooltip title="Read clipboard" arrow>
        <button onClick={() => readClipboard()}>read</button>
      </Tooltip>

      Clipboard value: {clipboardState}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
