import React, { ReactElement, useState } from 'react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import { Tooltip } from '../Tooltip';
import { TooltipArrow } from '../TooltipArrow';

export default {
  title: 'Components|Tooltip',
};

const StyledTooltip = styled(Tooltip)`
  background-color: #fff;
  color: #000;
  box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.2);

  ${TooltipArrow} {
    color: #fff;
  }
`;

const Scroll = styled.div`
  height: 150vh;

  display: flex;
  align-items: center;
  justify-content: center;
`;


export const Basic = (): ReactElement => (
  <Tooltip title="Default button">
    <button type="button">Button</button>
  </Tooltip>
);

export const Interactive = (): ReactElement => (
  <Tooltip title="Interactive button" interactive>
    <button type="button">Button</button>
  </Tooltip>
);

export const WithArrow = (): ReactElement => (
  <Tooltip title="Button with arrow" arrow>
    <button type="button">Button</button>
  </Tooltip>
);

export const WithCallbacks = (): ReactElement => (
  <Tooltip title="Button with callback" onOpen={action('open')} onClose={action('close')}>
    <button type="button">Button</button>
  </Tooltip>
);

export const WithDelay = (): ReactElement => (
  <Tooltip title="Delayed tooltip" enterDelay={500} leaveDelay={500}>
    <button type="button">Button</button>
  </Tooltip>
);

export const WithControllOpen = (): ReactElement => {
  const [state, setState] = useState(false);

  return (
    <Tooltip title="Controlled tooltip" open={state}>
      <button type="button" onClick={(): void => setState(!state)}>Button</button>
    </Tooltip>
  );
};

export const WithScroll = (): ReactElement => {
  const [state, setState] = useState(false);

  return (
    <Scroll>
      <Tooltip title="Controlled tooltip" open={state}>
        <button type="button" onClick={(): void => setState(!state)}>Button</button>
      </Tooltip>
    </Scroll>
  );
};

export const WithCustomized = (): ReactElement => (
  <StyledTooltip title="Customized tooltip" arrow>
    <button type="button">Button</button>
  </StyledTooltip>
);
