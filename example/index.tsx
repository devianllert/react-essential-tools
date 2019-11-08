import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Portal } from '../.';

const App = () => {
  return (
    <div>
      <Portal>
        <div>123</div>
      </Portal>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
