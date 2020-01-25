export const matchKeyboardKey = (
  e: KeyboardEvent,
  identifier: string | number,
): boolean => {
  if (
    e.key === identifier
    || e.code === identifier
    || e.keyCode === identifier
    || e.which === identifier
    || e.charCode === identifier
  ) return true;

  return false;
};
