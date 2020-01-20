import * as React from 'react';

import { useIntersection } from '../useIntersection';

export default {
  title: 'Hooks|useIntersection',
};

const Spacer = () => (
  <div
    style={{
      width: '200px',
      height: '300px',
      backgroundColor: 'whitesmoke',
    }}
  />
);

export const Basic = () => {
  const intersectionRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  });

  return (
    <div
      style={{
        width: '400px',
        height: '400px',
        backgroundColor: 'whitesmoke',
        overflow: 'scroll',
      }}
    >
      Scroll me
      <Spacer />
      <div
        ref={intersectionRef}
        style={{
          width: '100px',
          height: '100px',
          padding: '20px',
          backgroundColor: 'palegreen',
        }}
      >
        {intersection.entry && intersection.entry.intersectionRatio < 1 ? 'Obscured' : 'Fully in view'}
      </div>
      <Spacer />
    </div>
  );
};
