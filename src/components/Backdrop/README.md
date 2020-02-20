# `Backdrop`

[Demo](https://devianllert.github.io/react-essential-tools/?path=/story/components-backdrop--basic)

The backdrop component is used to provide emphasis on a particular element or parts of it.

The overlay signals to the user of a state change within the application and can be used for creating loaders, dialogs and more. In its simplest form, the backdrop component will add a dimmed layer over your application.

```jsx
export const SimpleBackdrop = (): ReactElement => {
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
```