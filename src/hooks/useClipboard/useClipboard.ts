import { useState, useCallback } from 'react';

interface UseClipboardState {
  clipboardState: string;
  setClipboard: (value: string) => Promise<void>;
  readClipboard: () => Promise<void>;
}

const NOT_ALLOWED_ERROR = new Error('Not Allowed');

const createInput = (): HTMLInputElement => {
  const i = document.createElement('input');
  i.setAttribute('size', '0');

  i.style.setProperty('border-width', '0');
  i.style.setProperty('bottom', '0');
  i.style.setProperty('margin-left', '0');
  i.style.setProperty('margin-top', '0');
  i.style.setProperty('outline-width', '0');
  i.style.setProperty('padding-bottom', '0');
  i.style.setProperty('padding-left', '0');
  i.style.setProperty('padding-right', '0');
  i.style.setProperty('padding-top', '0');
  i.style.setProperty('right', '0');

  i.style.setProperty('box-sizing', 'border-box');
  i.style.setProperty('margin-bottom', '-1px');
  i.style.setProperty('margin-right', '-1px');
  i.style.setProperty('width', '1px');
  i.style.setProperty('height', '1px');
  i.style.setProperty('max-width', '1px');
  i.style.setProperty('max-height', '1px');
  i.style.setProperty('min-width', '1px');
  i.style.setProperty('min-height', '1px');
  i.style.setProperty('outline-color', 'transparent');
  i.style.setProperty('position', 'absolute');
  i.style.setProperty('user-select', 'auto');

  document.body.appendChild(i);

  return i;
};

const removeInput = (i: HTMLInputElement): void => {
  document.body.removeChild(i);
};

const read = (): Promise<string> => new Promise((resolve, reject): void => {
  const i = createInput();
  i.focus();

  const success = document.execCommand('paste');

  if (!success) {
    removeInput(i);

    reject(NOT_ALLOWED_ERROR);
  }

  const { value } = i;

  removeInput(i);

  resolve(value);
});

const write = (text: string): Promise<void> => new Promise((resolve, reject): void => {
  const i = createInput();
  i.setAttribute('value', text);
  i.select();

  const success = document.execCommand('copy');

  removeInput(i);

  if (!success) {
    reject(NOT_ALLOWED_ERROR);
  }

  resolve();
});

/**
 * Hook for reading from and writing to the user's clipboard.
 */

export const useClipboard = (): UseClipboardState => {
  const [clipboardState, setClipboardState] = useState('');

  const setClipboard = useCallback(async (value: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(value);
    } else {
      await write(value);
    }

    setClipboardState(value);
  }, []);

  const readClipboard = useCallback(async () => {
    let clipboard: string;

    if (navigator.clipboard) {
      clipboard = await navigator.clipboard.readText();
    } else {
      clipboard = await read();
    }

    setClipboardState(clipboard);
  }, []);

  return {
    clipboardState,
    setClipboard,
    readClipboard,
  };
};
