import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Portal, Popper, Tooltip } from '../.';

const App = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div>
      <Portal>
        <div>123</div>
      </Portal>

      <div>
        <button aria-describedby={id} type="button" onClick={handleClick}>
          Toggle Popper
        </button>
        <Popper id={id} open={open} anchorEl={anchorEl} placement="right">
          <div>The content of the Popper.</div>
        </Popper>
      </div>

      <div>
        <Tooltip title="It's button tooltip">
          <button type="button" onClick={handleClick}>
            Toggle Popper
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
