import React, { ReactElement } from 'react';

import { Backdrop } from '../Backdrop';

export default {
  title: 'Components|Backdrop',
};

export const Basic = (): ReactElement => {
  const [open, setOpened] = React.useState(false);

  const handleOpen = (): void => {
    setOpened(true);
  };

  const handleClose = (): void => {
    setOpened(false);
  };

  return (
    <>
      <button type="button" onClick={handleOpen}>
        {open ? 'close' : 'open'}
      </button>

      <Backdrop
        open={open}
        onClick={handleClose}
        style={{ zIndex: 10, color: '#fff' }}
      >
        Backdrop
      </Backdrop>
    </>
  );
};
