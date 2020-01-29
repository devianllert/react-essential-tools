import React from 'react';

import { useLongPress } from '../useLongPress';

export default {
  title: 'Hooks|useLongPress',
};

export const Basic = () => {
  const onLongPress = (): void => {
    console.log('calls callback after long pressing 300ms');
  };

  const {
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onTouchEnd,
    onTouchStart,
  } = useLongPress(onLongPress, {
    isPreventDefault: true,
    delay: 300,
  });

  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
    >
      useLongPress
    </button>
  );
};
