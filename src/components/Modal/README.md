# `Modal`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/components-modal--basic)

The modal component provides a solid foundation for creating dialogs, popovers, lightboxes, or whatever else.

- Manages modal stacking when one-at-a-time just isn't enough.
- Creates a backdrop, for disabling interaction below the modal.
- It properly manages focus; moving to the modal content, and keeping it there until the modal is closed.
- It disables scrolling of the page content while open.
- Adds the appropriate ARIA roles are automatically.

# Example

```jsx
import React from 'react';
import { Modal } from 'react-essential-tools';

export default function SimpleModal() {
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

      <Modal open={open} onClose={handleClose}>
        <div>
          <h2>Modal title</h2>

          <div>
            <button type="button" onClick={handleClose}>
              close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
```

> Note: for fixed elements you can add `.retool-fixed` class to prevent content from shifting.


## Transitions

The open/close state of the modal can be animated with a transition component. This component should respect the following conditions:

- Be a direct child descendent of the modal.
- Have an in prop. This corresponds to the open / close state.
- Call the onEnter callback prop when the enter transition starts.
- Call the onExited callback prop when the exit transition is completed. These two callbacks allow the modal to unmount the child content when closed and fully transitioned.

```jsx
import React, { useState } from 'react';
import { Modal, Fade, Backdrop } from 'react-essential-tools';

export default function TransitionsModal() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        {open ? 'close' : 'open'}
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div>
            <h2>Modal title</h2>

            <div>
              <button type="button" onClick={handleClose}>
                close
              </button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
```