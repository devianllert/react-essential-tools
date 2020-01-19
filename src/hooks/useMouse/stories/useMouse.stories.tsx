import * as React from 'react';

import { useMouse } from '../useMouse';

export default {
  title: 'Hooks|useMouse',
};

export const Basic = () => {
  const ref = React.useRef(null);
  const state = useMouse(ref);

  return (
    <>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <br />
      <br />
      <div
        ref={ref}
        style={{
          position: 'relative',
          width: '400px',
          height: '400px',
          backgroundColor: 'whitesmoke',
        }}
      >
        <span
          role="img"
          aria-label="mouse"
          style={{
            position: 'absolute',
            left: `${state.elX}px`,
            top: `${state.elY}px`,
            pointerEvents: 'none',
            transform: 'scale(4)',
          }}
        >
          🐭
        </span>
      </div>
    </>
  );
};
