import React, { ReactElement, useState, MouseEvent } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, select } from '@storybook/addon-knobs';

import { Popper } from '../Popper';
import { Grow } from '../../Grow';

export default {
  title: 'Components|Popper',
  decorators: [withKnobs],
};

const actions = {
  open: action('open'),
  close: action('close'),
};

export const Basic = (): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<Element>();

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    if (!anchorEl) {
      setAnchorEl(event.currentTarget);
      actions.open();

      return;
    }

    setAnchorEl(undefined);
    actions.close();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div>
      <button aria-describedby={id} type="button" onClick={handleClick}>
        Toggle Popper
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <div>The content of the Popper.</div>
      </Popper>
    </div>
  );
};

export const WithPosition = (): ReactElement => {
  const pos = select(
    'position',
    {
      'auto-start': 'auto-start',
      auto: 'auto',
      'auto-end': 'auto-end',
      'top-start': 'top-start',
      top: 'top',
      'top-end': 'top-end',
      'right-start': 'right-start',
      right: 'right',
      'right-end': 'right-end',
      'bottom-end': 'bottom-end',
      bottom: 'bottom',
      'bottom-start': 'bottom-start',
      'left-end': 'left-end',
      left: 'left',
      'left-start': 'left-start',
    },
    'bottom',
  );

  const [anchorEl, setAnchorEl] = useState<Element>();

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    if (!anchorEl) {
      setAnchorEl(event.currentTarget);
      actions.open();

      return;
    }

    setAnchorEl(undefined);
    actions.close();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div>
      <button aria-describedby={id} type="button" onClick={handleClick}>
        Toggle Popper
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl} placement={pos}>
        <div>The content of the Popper.</div>
      </Popper>
    </div>
  );
};

export const WithTransition = (): ReactElement => {
  const pos = select(
    'position',
    {
      'auto-start': 'auto-start',
      auto: 'auto',
      'auto-end': 'auto-end',
      'top-start': 'top-start',
      top: 'top',
      'top-end': 'top-end',
      'right-start': 'right-start',
      right: 'right',
      'right-end': 'right-end',
      'bottom-end': 'bottom-end',
      bottom: 'bottom',
      'bottom-start': 'bottom-start',
      'left-end': 'left-end',
      left: 'left',
      'left-start': 'left-start',
    },
    'bottom',
  );

  const [anchorEl, setAnchorEl] = useState<Element>();

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    if (!anchorEl) {
      setAnchorEl(event.currentTarget);
      actions.open();

      return;
    }

    setAnchorEl(undefined);
    actions.close();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div>
      <button aria-describedby={id} type="button" onClick={handleClick}>
        Toggle Popper
      </button>
      <Popper key={pos} id={id} open={open} anchorEl={anchorEl} placement={pos} transition>
        {({ TransitionProps }): ReactElement => (
          <Grow
            in={TransitionProps?.in}
            onEnter={TransitionProps?.onEnter}
            onExited={TransitionProps?.onExited}
          >
            <div>The content of the Popper.</div>
          </Grow>
        )}
      </Popper>
    </div>
  );
};
