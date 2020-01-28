import React, { ReactElement } from 'react';
import { action } from '@storybook/addon-actions';

import { Slide } from '../Slide';

export default {
  title: 'Components|Slide',
};

const actions = {
  enter: action('enter'),
  entering: action('entering'),
  entered: action('entered'),
  exit: action('exit'),
  exiting: action('exiting'),
  exited: action('exited'),
};

export const Basic = (): ReactElement => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (): void => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <button type="button" onClick={handleChange}>{checked ? 'out' : 'in'}</button>

      <Slide in={checked}>
        <div>Grow</div>
      </Slide>
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

      <Slide
        in={checked}
        onEnter={actions.enter}
        onEntering={actions.entering}
        onEntered={actions.entered}
        onExit={actions.exit}
        onExiting={actions.exiting}
        onExited={actions.exited}
      >
        <div>Fade</div>
      </Slide>
    </>
  );
};
