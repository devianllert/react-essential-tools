// based on https://github.com/WICG/focus-visible/blob/v4.1.5/src/focus-visible.js
import { useCallback, ChangeEvent } from 'react';

interface UseIsFocusVisibleProps {
  isFocusVisible: (event: ChangeEvent) => boolean;
  onBlurVisible: () => void;
  ref: (instance: HTMLElement) => void;
}

let hadKeyboardEvent = true;
let hadFocusVisibleRecently = false;
let hadFocusVisibleRecentlyTimeout: number | null = null;

const inputTypesWhitelist = {
  text: true,
  search: true,
  url: true,
  tel: true,
  email: true,
  password: true,
  number: true,
  date: true,
  month: true,
  week: true,
  time: true,
  datetime: true,
  'datetime-local': true,
};

/**
 * Computes whether the given element should automatically trigger the
 * `focus-visible` class being added, i.e. whether it should always match
 * `:focus-visible` when focused.
 * @param {Element} node
 * @return {boolean}
 */
const focusTriggersKeyboardModality = (node: HTMLElement & HTMLInputElement): boolean => {
  const { type, tagName } = node;

  if (tagName === 'INPUT' && inputTypesWhitelist[type as keyof typeof inputTypesWhitelist] && !node.readOnly) {
    return true;
  }

  if (tagName === 'TEXTAREA' && !node.readOnly) {
    return true;
  }

  if (node.isContentEditable) {
    return true;
  }

  return false;
};

const handleKeyDown = (): void => {
  hadKeyboardEvent = true;
};

/**
 * If at any point a user clicks with a pointing device, ensure that we change
 * the modality away from keyboard.
 * This avoids the situation where a user presses a key on an already focused
 * element, and then clicks on a different element, focusing it with a
 * pointing device, while we still think we're in keyboard modality.
 * @param {Event} e
 */
const handlePointerDown = (): void => {
  hadKeyboardEvent = false;
};

function handleVisibilityChange(this: Document): void {
  if (this.visibilityState === 'hidden') {
    // If the tab becomes active again, the browser will handle calling focus
    // on the element (Safari actually calls it twice).
    // If this tab change caused a blur on an element with focus-visible,
    // re-apply the class when the user switches back to the tab.
    if (hadFocusVisibleRecently) {
      hadKeyboardEvent = true;
    }
  }
}

const prepare = (ownerDocument: Document): void => {
  ownerDocument.addEventListener('keydown', handleKeyDown, true);
  ownerDocument.addEventListener('mousedown', handlePointerDown, true);
  ownerDocument.addEventListener('pointerdown', handlePointerDown, true);
  ownerDocument.addEventListener('touchstart', handlePointerDown, true);
  ownerDocument.addEventListener('visibilitychange', handleVisibilityChange, true);
};

export const teardown = (ownerDocument: Document): void => {
  ownerDocument.removeEventListener('keydown', handleKeyDown, true);
  ownerDocument.removeEventListener('mousedown', handlePointerDown, true);
  ownerDocument.removeEventListener('pointerdown', handlePointerDown, true);
  ownerDocument.removeEventListener('touchstart', handlePointerDown, true);
  ownerDocument.removeEventListener('visibilitychange', handleVisibilityChange, true);
};

const isFocusVisible = (event: ChangeEvent): boolean => {
  const { target } = event;
  try {
    return (target as HTMLElement).matches(':focus-visible');
  } catch (error) {
    // browsers not implementing :focus-visible will throw a SyntaxError
    // we use our own heuristic for those browsers
    // rethrow might be better if it's not the expected error but do we really
    // want to crash if focus-visible malfunctioned?
  }

  // no need for validFocusTarget check. the user does that by attaching it to
  // focusable events only
  return hadKeyboardEvent || focusTriggersKeyboardModality(target as HTMLElement & HTMLInputElement);
};

/**
 * Should be called if a blur event is fired on a focus-visible element
 */
const handleBlurVisible = (): void => {
  // To detect a tab/window switch, we look for a blur event followed
  // rapidly by a visibility change.
  // If we don't see a visibility change within 100ms, it's probably a
  // regular focus change.
  hadFocusVisibleRecently = true;
  window.clearTimeout(hadFocusVisibleRecentlyTimeout as number);

  hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
    hadFocusVisibleRecently = false;
    window.clearTimeout(hadFocusVisibleRecentlyTimeout as number);
  }, 100);
};

export const useIsFocusVisible = (): UseIsFocusVisibleProps => {
  const ref = useCallback((instance: HTMLElement) => {
    if (instance != null) {
      prepare(instance.ownerDocument as Document);
    }
  }, []);

  return { isFocusVisible, onBlurVisible: handleBlurVisible, ref };
};
