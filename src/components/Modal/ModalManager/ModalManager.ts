/* eslint-disable no-param-reassign */

export interface Modal {
  modalRef?: HTMLElement | null;
  mountNode?: HTMLElement | null;
}

export interface Container {
  modals: Modal[];
  container: HTMLElement;
  restore: (() => void) | null;
  hiddenSiblingNodes: HTMLElement[];
}

interface ModalProps {
  disableScrollLock?: boolean;
}

interface ModalRestoreStyles {
  value: string;
  key: string;
  el: HTMLElement;
}

const getScrollbarSize = (): number => {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.width = '99px';
  scrollDiv.style.height = '99px';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';
  scrollDiv.style.overflow = 'scroll';

  document.body.appendChild(scrollDiv);
  const scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return scrollbarSize;
};

const ownerDocument = (node: HTMLElement): Document => (node && node.ownerDocument) || document;

const ownerWindow = (doc: Document): Window => doc.defaultView || window;

// Is a vertical scrollbar displayed?
const isOverflowing = (container: HTMLElement): boolean => {
  const doc = ownerDocument(container);

  if (doc.body === container) {
    return ownerWindow(doc).innerWidth > doc.documentElement.clientWidth;
  }

  return container.scrollHeight > container.clientHeight;
};

export const ariaHidden = (node: HTMLElement, show: boolean): void => {
  if (show) {
    node.setAttribute('aria-hidden', 'true');
  } else {
    node.removeAttribute('aria-hidden');
  }
};

const getPaddingRight = (node: HTMLElement): number => parseInt(window.getComputedStyle(node).paddingRight, 10) || 0;

const ariaHiddenSiblings = (
  container: HTMLElement,
  mountNode: HTMLElement,
  currentNode: HTMLElement,
  nodesToExclude: HTMLElement[] = [],
  show: boolean,
): void => {
  const blacklist = [mountNode, currentNode, ...nodesToExclude];
  const blacklistTagNames = ['TEMPLATE', 'SCRIPT', 'STYLE'];

  [].forEach.call(container.children, (node: HTMLElement) => {
    if (node.nodeType === 1 && blacklist.indexOf(node) === -1 && blacklistTagNames.indexOf(node.tagName) === -1) {
      ariaHidden(node, show);
    }
  });
};

const findIndexOf = (containerInfo: Container[], callback: (item: Container) => boolean): number => {
  let idx = -1;

  containerInfo.some((item, index) => {
    if (callback(item)) {
      idx = index;

      return true;
    }

    return false;
  });

  return idx;
};

const handleContainer = (containerInfo: Container, props: ModalProps): (() => void) => {
  const restoreStyle: ModalRestoreStyles[] = [];
  const restorePaddings: string[] = [];
  const { container } = containerInfo;
  let fixedNodes: NodeListOf<Element>;

  if (!props.disableScrollLock) {
    if (isOverflowing(container)) {
      // Compute the size before applying overflow hidden to avoid any scroll jumps.
      const scrollbarSize = getScrollbarSize();

      restoreStyle.push({
        value: container.style.paddingRight,
        key: 'padding-right',
        el: container,
      });
      // Use computed style, here to get the real padding to add our scrollbar width.
      container.style.paddingRight = `${getPaddingRight(container) + scrollbarSize}px`;

      // .retool-fixed is a global helper.
      fixedNodes = ownerDocument(container).querySelectorAll('.retool-fixed');
      [].forEach.call(fixedNodes, (node: HTMLElement) => {
        restorePaddings.push(node.style.paddingRight);
        node.style.paddingRight = `${getPaddingRight(node) + scrollbarSize}px`;
      });
    }

    // Check forcing vertical scroll
    const parent = container.parentElement;
    const scrollContainer = ((parent?.nodeName === 'HTML') && (window.getComputedStyle(parent).overflowY === 'scroll'))
      ? parent
      : container;

    // Block the scroll even if no scrollbar is visible to account for mobile keyboard
    // screensize shrink.
    restoreStyle.push({
      value: scrollContainer.style.overflow,
      key: 'overflow',
      el: scrollContainer,
    });

    scrollContainer.style.overflow = 'hidden';
  }

  const restore = (): void => {
    if (fixedNodes) {
      [].forEach.call(fixedNodes, (node: HTMLElement, i) => {
        if (restorePaddings[i]) {
          node.style.paddingRight = restorePaddings[i];
        } else {
          node.style.removeProperty('padding-right');
        }
      });
    }

    restoreStyle.forEach(({ value, el, key }: ModalRestoreStyles) => {
      if (value) {
        el.style.setProperty(key, value);
      } else {
        el.style.removeProperty(key);
      }
    });
  };

  return restore;
};

const getHiddenSiblings = (container: HTMLElement): HTMLElement[] => {
  const hiddenSiblings: HTMLElement[] = [];

  [].forEach.call(container.children, (node: HTMLElement) => {
    if (node.getAttribute && node.getAttribute('aria-hidden') === 'true') {
      hiddenSiblings.push(node);
    }
  });

  return hiddenSiblings;
};

/**
 * Proper state management for containers and the modals in those containers.
 * Used by the Modal to ensure proper styling of containers.
 */
export class ModalManager {
  modals: Modal[];

  containers: Container[];

  constructor() {
    this.modals = [];
    this.containers = [];
  }

  isTopModal(modal: Modal): boolean {
    return this.modals.length > 0 && this.modals[this.modals.length - 1] === modal;
  }

  add(modal: Modal, container: HTMLElement): number {
    let modalIndex = this.modals.indexOf(modal);
    if (modalIndex !== -1) {
      return modalIndex;
    }

    modalIndex = this.modals.length;
    this.modals.push(modal);

    // If the modal we are adding is already in the DOM.
    if (modal.modalRef) {
      ariaHidden(modal.modalRef, false);
    }

    const hiddenSiblingNodes = getHiddenSiblings(container);
    ariaHiddenSiblings(container, modal.mountNode!, modal.modalRef!, hiddenSiblingNodes, true);

    const containerIndex = findIndexOf(this.containers, (item: Container) => item.container === container);

    if (containerIndex !== -1) {
      this.containers[containerIndex].modals.push(modal);

      return modalIndex;
    }

    this.containers.push({
      modals: [modal],
      container,
      restore: null,
      hiddenSiblingNodes,
    });

    return modalIndex;
  }

  mount(modal: Modal, props: ModalProps): void {
    const containerIndex = findIndexOf(this.containers, (item: Container) => item.modals.indexOf(modal) !== -1);
    const containerInfo = this.containers[containerIndex];

    if (!containerInfo.restore) {
      containerInfo.restore = handleContainer(containerInfo, props);
    }
  }

  remove(modal: Modal): number {
    const modalIndex = this.modals.indexOf(modal);

    if (modalIndex === -1) {
      return modalIndex;
    }

    const containerIndex = findIndexOf(this.containers, (item: Container) => item.modals.indexOf(modal) !== -1);
    const containerInfo = this.containers[containerIndex];

    containerInfo.modals.splice(containerInfo.modals.indexOf(modal), 1);
    this.modals.splice(modalIndex, 1);

    // If that was the last modal in a container, clean up the container.
    if (containerInfo.modals.length === 0) {
      // The modal might be closed before it had the chance to be mounted in the DOM.
      if (containerInfo.restore) {
        containerInfo.restore();
      }

      if (modal.modalRef) {
        // In case the modal wasn't in the DOM yet.
        ariaHidden(modal.modalRef, true);
      }

      ariaHiddenSiblings(
        containerInfo.container,
        modal.mountNode!,
        modal.modalRef!,
        containerInfo.hiddenSiblingNodes,
        false,
      );
      this.containers.splice(containerIndex, 1);
    } else {
      // Otherwise make sure the next top modal is visible to a screen reader.
      const nextTop = containerInfo.modals[containerInfo.modals.length - 1];
      // as soon as a modal is adding its modalRef is undefined. it can't set
      // aria-hidden because the dom element doesn't exist either
      // when modal was unmounted before modalRef gets null
      if (nextTop.modalRef) {
        ariaHidden(nextTop.modalRef, false);
      }
    }

    return modalIndex;
  }
}
