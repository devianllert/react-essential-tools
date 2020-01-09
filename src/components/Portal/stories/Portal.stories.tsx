import React, { ReactElement, useState, useRef } from 'react';
import styled from 'styled-components';

import { Portal } from '../Portal';

export default {
  title: 'Portal',
};

const Content = styled.div`
  padding: 4px;
  margin: 4px 0;
  border: 1px solid;
`;

export const Basic = (): ReactElement => (
  <Portal>
    <div>I am portaled</div>
  </Portal>
);

export const Disabled = (): ReactElement => (
  <Portal disablePortal>
    <div>I am not portaled</div>
  </Portal>
);

export const WithContainer = (): ReactElement => {
  const [show, setShow] = useState(false);
  const container = useRef(null);

  const handleClick = (): void => {
    setShow(!show);
  };

  return (
    <>
      <button type="button" onClick={handleClick}>
        {show ? 'Unmount children' : 'Mount children'}
      </button>

      <Content>
        It looks like I will render here.
        {show ? (
          <Portal container={container.current}>
            <span>But I actually render here!</span>
          </Portal>
        ) : null}
      </Content>

      <Content ref={container} />
    </>
  );
};
