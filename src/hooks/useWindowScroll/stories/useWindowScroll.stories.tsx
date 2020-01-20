import * as React from 'react';

import { useWindowScroll } from '../useWindowScroll';

export default {
  title: 'Hooks|useWindowScroll',
};

export const Basic = () => {
  const { x, y } = useWindowScroll();

  return (
    <div
      style={{
        width: '200vw',
        height: '200vh',
      }}
    >
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
        }}
      >
        <div>
          x:
          {x}
        </div>
        <div>
          y:
          {y}
        </div>
      </div>
    </div>
  );
};
