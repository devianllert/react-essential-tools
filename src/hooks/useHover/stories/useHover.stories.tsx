import * as React from 'react';
import styled from 'styled-components';

import { useHover } from '../useHover';

const Hoverable = styled.div`
  padding: 16px;
  margin: 16px;
  border: 1px solid;
`;

export default {
  title: 'Hooks|useHover',
};

export const Basic = () => {
  const [hovered, { onMouseEnter, onMouseLeave }] = useHover();

  return (
    <div>
      <Hoverable style={{ color: hovered ? 'green' : 'black' }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        Hover me
      </Hoverable>

      {hovered ? 'hovered' : 'not hovered'}
    </div>
  );
};
