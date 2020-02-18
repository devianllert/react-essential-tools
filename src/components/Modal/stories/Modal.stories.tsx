import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';

import { Modal } from '../Modal';
import { Grow } from '../../Grow';

export default {
  title: 'Components|Modal',
};

const Scroll = styled.div`
  height: 150vh;
`;

const Box = styled.div`
  box-sizing: border-box;

  width: 100%;
  height: 40px;

  margin: 8px 0;

  background-color: #d4d4d4;
  color: #ffffff;
`;

const StyledModal = styled(Modal)`
  display: flex;

  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  padding: 16px;

  width: 300px;

  background-color: #fff;

  outline: 0;
`;

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

      <StyledModal open={open} onClose={handleClose}>
        <ModalBox>
          <h2>Modal title</h2>

          <div>
            <button type="button" onClick={action('modal')}>
              action
            </button>
            <button type="button" onClick={handleClose}>
              close
            </button>
          </div>
        </ModalBox>
      </StyledModal>
    </>
  );
};

export const WithTransition = (): ReactElement => {
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

      <StyledModal open={open} onClose={handleClose}>
        <Grow in={open}>
          <ModalBox>
            <h2>Modal title</h2>

            <div>
              <button type="button" onClick={action('modal')}>
                action
              </button>
              <button type="button" onClick={handleClose}>
                close
              </button>
            </div>
          </ModalBox>
        </Grow>
      </StyledModal>
    </>
  );
};

export const WithScroll = (): ReactElement => {
  const [open, setOpened] = React.useState(false);

  const handleOpen = (): void => {
    setOpened(true);
  };

  const handleClose = (): void => {
    setOpened(false);
  };

  return (
    <Scroll>
      <button type="button" onClick={handleOpen}>
        {open ? 'close' : 'open'}
      </button>

      <Box />
      <Box className="mui-fixed" />

      <StyledModal open={open} onClose={handleClose}>
        <ModalBox>
          <h2>Modal title</h2>

          <div>
            <button type="button" onClick={action('modal')}>
              action
            </button>
            <button type="button" onClick={handleClose}>
              close
            </button>
          </div>
        </ModalBox>
      </StyledModal>
    </Scroll>
  );
};
