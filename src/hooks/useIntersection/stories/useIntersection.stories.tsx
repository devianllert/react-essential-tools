import * as React from 'react';
import styled from 'styled-components';

import { useIntersection } from '../useIntersection';

export default {
  title: 'Hooks|useIntersection',
};

const Spacer = styled.div`
  width: 200px;
  height: 300px;
  background-color: whitesmoke;
`;

export const Basic = () => {
  const [ref, intersection] = useIntersection({
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
        ref={ref}
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

export const WithOnce = () => {
  const [ref, intersection] = useIntersection({
    root: null,
    rootMargin: '0px',
    threshold: 1,
    triggerOnce: true,
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
        ref={ref}
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
