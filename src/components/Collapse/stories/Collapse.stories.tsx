import React, { ReactElement } from 'react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import { Collapse } from '../Collapse';

export default {
  title: 'Components|Collapse',
};

const actions = {
  enter: action('enter'),
  entering: action('entering'),
  entered: action('entered'),
  exit: action('exit'),
  exiting: action('exiting'),
  exited: action('exited'),
};

const Block = styled.div`
  width: 160px;
  height: 160px;
  background-color: #d4d4d4;
`;

export const Vertical = (): ReactElement => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (): void => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <button type="button" onClick={handleChange}>{checked ? 'out' : 'in'}</button>

      <Collapse in={checked}>
        <Block>Collapse</Block>
      </Collapse>
    </>
  );
};

export const Horizontal = (): ReactElement => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (): void => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <button type="button" onClick={handleChange}>{checked ? 'out' : 'in'}</button>

      <Collapse in={checked} orientation="horizontal">
        <Block>Collapse</Block>
      </Collapse>
    </>
  );
};

export const WithCallbacks = (): ReactElement => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (): void => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <button type="button" onClick={handleChange}>{checked ? 'out' : 'in'}</button>

      <Collapse
        in={checked}
        onEnter={actions.enter}
        onEntering={actions.entering}
        onEntered={actions.entered}
        onExit={actions.exit}
        onExiting={actions.exiting}
        onExited={actions.exited}
      >
        <Block>Collapse</Block>
      </Collapse>
    </>
  );
};
