import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Tooltip, useLocalStorage } from '../.';

const App = () => {
  const [ver, setVer] = useLocalStorage('version', 0.1);

  return (
    <div>
      <Tooltip title="Enter value here" arrow placement="bottom-end">
        <input type="number" value={ver} onChange={(evt) => setVer(+evt.target.value)}/>
      </Tooltip>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
