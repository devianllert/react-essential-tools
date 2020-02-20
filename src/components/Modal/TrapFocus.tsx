/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import * as React from 'react';

import { useForkRef } from '../../utils/useForkRef';

interface Props {
  children: React.ReactElement;
  disableAutoFocus: boolean;
  disableEnforceFocus: boolean;
  disableRestoreFocus: boolean;
  getDoc: () => Document;
  isEnabled: () => boolean;
  open: boolean;
}

export const TrapFocus = (props: Props): React.ReactElement => {
  const {
    children,
    disableAutoFocus = false,
    disableEnforceFocus = false,
    disableRestoreFocus = false,
    getDoc,
    isEnabled,
    open,
  } = props;

  const ignoreNextEnforceFocus = React.useRef<boolean>();
  const sentinelStart = React.useRef<HTMLDivElement>(null);
  const sentinelEnd = React.useRef<HTMLDivElement>(null);
  const nodeToRestore = React.useRef<HTMLElement | null>();
  const rootRef = React.useRef<HTMLElement>();

  const handleOwnRef = React.useCallback((instance) => {
    rootRef.current = instance;
  }, []);

  const handleRef = useForkRef((children as any).ref, handleOwnRef);

  React.useMemo(() => {
    if (!open || typeof window === 'undefined') {
      return;
    }

    nodeToRestore.current = getDoc().activeElement as HTMLElement;
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const doc = rootRef.current?.ownerDocument || document;

    if (!disableAutoFocus && rootRef.current && !rootRef.current.contains(doc.activeElement)) {
      if (!rootRef.current.hasAttribute('tabIndex')) {
        rootRef.current.setAttribute('tabIndex', '-1');
      }

      rootRef.current.focus();
    }

    const contain = (): void => {
      if (disableEnforceFocus || !isEnabled() || ignoreNextEnforceFocus.current) {
        ignoreNextEnforceFocus.current = false;
        return;
      }

      if (rootRef.current && !rootRef.current.contains(doc.activeElement)) {
        rootRef.current.focus();
      }
    };

    const loopFocus = (event: KeyboardEvent): void => {
      const isTab = event.key === 'Tab'
        || event.code === 'Tab'
        || event.which === 9
        || event.keyCode === 9;

      if (disableEnforceFocus || !isEnabled() || !isTab) {
        return;
      }

      // Make sure the next tab starts from the right place.
      if (doc.activeElement === rootRef.current) {
        // We need to ignore the next contain as
        // it will try to move the focus back to the rootRef element.
        ignoreNextEnforceFocus.current = true;

        if (event.shiftKey) {
          if (sentinelEnd.current) sentinelEnd.current.focus();

          return;
        }

        if (sentinelStart.current) sentinelStart.current.focus();
      }
    };

    doc.addEventListener('focus', contain, true);
    doc.addEventListener('keydown', loopFocus, true);

    // With Edge, Safari and Firefox, no focus related events are fired when the focused area stops being a focused area
    // e.g. https://bugzilla.mozilla.org/show_bug.cgi?id=559561.
    //
    // The whatwg spec defines how the browser should behave but does not explicitly mention any events:
    // https://html.spec.whatwg.org/multipage/interaction.html#focus-fixup-rule.
    const interval = setInterval(() => {
      contain();
    }, 50);

    return (): void => {
      clearInterval(interval);

      doc.removeEventListener('focus', contain, true);
      doc.removeEventListener('keydown', loopFocus, true);

      // restoreLastFocus()
      if (!disableRestoreFocus) {
        // In IE 11 it is possible for document.activeElement to be null resulting
        // in nodeToRestore.current being null.
        // Not all elements in IE 11 have a focus method.
        // Once IE 11 support is dropped the focus() call can be unconditional.
        if (nodeToRestore.current && nodeToRestore.current.focus) {
          nodeToRestore.current.focus();
        }

        nodeToRestore.current = null;
      }
    };
  }, [disableAutoFocus, disableEnforceFocus, disableRestoreFocus, isEnabled, open]);

  return (
    <>
      <div tabIndex={0} ref={sentinelStart} />
      {React.cloneElement(children, { ref: handleRef })}
      <div tabIndex={0} ref={sentinelEnd} />
    </>
  );
};
