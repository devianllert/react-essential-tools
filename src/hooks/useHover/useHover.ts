import * as React from 'react';

interface UseHoverEvents {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * Hook that track if element is being hovered by a mouse.
 */

export const useHover = (): [boolean, UseHoverEvents] => {
  const [state, setState] = React.useState(false);

  const onMouseEnter = (): void => setState(true);
  const onMouseLeave = (): void => setState(false);

  return [state, { onMouseEnter, onMouseLeave }];
};
