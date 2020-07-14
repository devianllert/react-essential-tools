import { ModalManager } from '../ModalManager';

import '@testing-library/jest-dom/extend-expect';

function getScrollbarSize(): number {
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
}

describe('ModalManager', () => {
  let modalManager: ModalManager;
  let container1: HTMLDivElement;

  beforeAll(() => {
    modalManager = new ModalManager();
    container1 = document.createElement('div');
    container1.style.paddingRight = '20px';

    Object.defineProperty(container1, 'scrollHeight', {
      value: 100,
      writable: false,
    });

    Object.defineProperty(container1, 'clientHeight', {
      value: 90,
      writable: false,
    });

    document.body.appendChild(container1);
  });

  afterAll(() => {
    document.body.removeChild(container1);
  });

  it('should add a modal only once', () => {
    const modal = {};
    const modalManager2 = new ModalManager();
    const idx = modalManager2.add(modal, container1);
    modalManager2.mount(modal, {});

    expect(modalManager2.add(modal, container1)).toBe(idx);

    modalManager2.remove(modal);
  });

  describe('managing modals', () => {
    let modal1: {
      modalRef: HTMLDivElement;
    };
    let modal2: {
      modalRef: HTMLDivElement;
    };
    let modal3: {
      modalRef: HTMLDivElement;
    };

    beforeAll(() => {
      modal1 = { modalRef: document.createElement('div') };
      modal2 = { modalRef: document.createElement('div') };
      modal3 = { modalRef: document.createElement('div') };
    });

    it('should add modal1', () => {
      const idx = modalManager.add(modal1, container1);
      modalManager.mount(modal1, {});

      expect(idx).toBe(0);
      expect(modalManager.isTopModal(modal1)).toBeTruthy();
    });

    it('should add modal2', () => {
      const idx = modalManager.add(modal2, container1);

      expect(idx).toBe(1);
      expect(modalManager.isTopModal(modal2)).toBeTruthy();
    });

    it('should add modal3', () => {
      const idx = modalManager.add(modal3, container1);

      expect(idx).toBe(2);
      expect(modalManager.isTopModal(modal3)).toBeTruthy();
    });

    it('should remove modal2', () => {
      const idx = modalManager.remove(modal2);

      expect(idx).toBe(1);
    });

    it('should add modal2 2', () => {
      const idx = modalManager.add(modal2, container1);
      modalManager.mount(modal2, {});

      expect(idx).toBe(2);
      expect(modalManager.isTopModal(modal2)).toBeTruthy();
      expect(modalManager.isTopModal(modal3)).toBeFalsy();
    });

    it('should remove modal3', () => {
      const idx = modalManager.remove(modal3);

      expect(idx).toBe(1);
    });

    it('should remove modal2 2', () => {
      const idx = modalManager.remove(modal2);

      expect(idx).toBe(1);
      expect(modalManager.isTopModal(modal1)).toBeTruthy();
    });

    it('should remove modal1', () => {
      const idx = modalManager.remove(modal1);

      expect(idx).toBe(0);
    });

    it('should not do anything', () => {
      const idx = modalManager.remove({});

      expect(idx).toBe(-1);
    });
  });

  describe('overflow', () => {
    let fixedNode: HTMLDivElement;

    beforeEach(() => {
      container1.style.paddingRight = '20px';

      fixedNode = document.createElement('div');
      fixedNode.classList.add('retool-fixed');
      document.body.appendChild(fixedNode);
    });

    afterEach(() => {
      document.body.removeChild(fixedNode);
    });

    it('should handle the scroll', () => {
      fixedNode.style.paddingRight = '14px';

      const modal = {};
      modalManager.add(modal, container1);
      modalManager.mount(modal, {});
      expect(container1.style.overflow).toBe('hidden');
      expect(container1.style.paddingRight).toBe(`${20 + getScrollbarSize()}px`);
      expect(fixedNode.style.paddingRight).toBe(`${14 + getScrollbarSize()}px`);

      modalManager.remove(modal);

      expect(container1.style.overflow).toBe('');
      expect(container1.style.paddingRight).toBe('20px');
      expect(fixedNode.style.paddingRight).toBe('14px');
    });

    it('should disable the scroll even when not overflowing', () => {
      // simulate non-overflowing container
      const container2 = document.createElement('div');
      Object.defineProperty(container2, 'scrollHeight', {
        value: 100,
        writable: false,
      });
      Object.defineProperty(container2, 'clientHeight', {
        value: 100,
        writable: false,
      });
      document.body.appendChild(container2);

      const modal = {};
      modalManager.add(modal, container2);
      modalManager.mount(modal, {});
      expect(container2.style.overflow).toBe('hidden');

      modalManager.remove(modal);
      expect(container2.style.overflow).toBe('');

      document.body.removeChild(container2);
    });

    it('should restore styles correctly if none existed before', () => {
      const modal = {};
      modalManager.add(modal, container1);
      modalManager.mount(modal, {});

      expect(container1.style.overflow).toBe('hidden');
      expect(container1.style.paddingRight).toBe(`${20 + getScrollbarSize()}px`);
      expect(fixedNode.style.paddingRight).toBe(`${0 + getScrollbarSize()}px`);

      modalManager.remove(modal);

      expect(container1.style.overflow).toBe('');
      expect(container1.style.paddingRight).toBe('20px');
      expect(fixedNode.style.paddingRight).toBe('');
    });
  });

  describe('multi container', () => {
    let container3: HTMLDivElement;
    let container4: HTMLDivElement;

    beforeEach(() => {
      container3 = document.createElement('div');
      document.body.appendChild(container3);
      container3.appendChild(document.createElement('div'));

      container4 = document.createElement('div');
      document.body.appendChild(container4);
      container4.appendChild(document.createElement('div'));
    });

    afterEach(() => {
      document.body.removeChild(container3);
      document.body.removeChild(container4);
    });

    it('should work will multiple containers', () => {
      modalManager = new ModalManager();
      const modal1 = {};
      const modal2 = {};
      modalManager.add(modal1, container3);
      modalManager.mount(modal1, {});
      expect(container3.children[0]).toHaveAttribute('aria-hidden');

      modalManager.add(modal2, container4);
      modalManager.mount(modal2, {});
      expect(container4.children[0]).toHaveAttribute('aria-hidden');

      modalManager.remove(modal2);
      expect(container4.children[0]).not.toHaveAttribute('aria-hidden');

      modalManager.remove(modal1);
      expect(container3.children[0]).not.toHaveAttribute('aria-hidden');
    });
  });

  describe('container aria-hidden', () => {
    let modalRef1: HTMLDivElement;
    let container2: HTMLDivElement;

    beforeEach(() => {
      container2 = document.createElement('div');
      document.body.appendChild(container2);

      modalRef1 = document.createElement('div');
      container2.appendChild(modalRef1);

      modalManager = new ModalManager();
    });

    afterEach(() => {
      document.body.removeChild(container2);
    });

    it('should not contain aria-hidden on modal', () => {
      const modal2 = document.createElement('div');
      modal2.setAttribute('aria-hidden', 'true');

      expect(modal2).toHaveAttribute('aria-hidden');

      modalManager.add({ modalRef: modal2 }, container2);
      expect(modal2).not.toHaveAttribute('aria-hidden');
    });

    it('should add aria-hidden to container siblings', () => {
      modalManager.add({}, container2);
      expect(container2.children[0]).toHaveAttribute('aria-hidden');
    });

    it('should add aria-hidden to previous modals', () => {
      const modal2 = document.createElement('div');
      const modal3 = document.createElement('div');

      container2.appendChild(modal2);
      container2.appendChild(modal3);

      modalManager.add({ modalRef: modal2 }, container2);
      // Simulate the main React DOM true.
      expect(container2.children[0]).toHaveAttribute('aria-hidden');
      expect(container2.children[1]).not.toHaveAttribute('aria-hidden');

      modalManager.add({ modalRef: modal3 }, container2);

      expect(container2.children[0]).toHaveAttribute('aria-hidden');
      expect(container2.children[1]).toHaveAttribute('aria-hidden');
      expect(container2.children[2]).not.toHaveAttribute('aria-hidden');
    });

    it('should remove aria-hidden on siblings', () => {
      const modal = { modalRef: container2.children[0] as HTMLElement };

      modalManager.add(modal, container2);
      modalManager.mount(modal, {});
      expect(container2.children[0]).not.toHaveAttribute('aria-hidden');

      modalManager.remove(modal);

      expect(container2.children[0]).toHaveAttribute('aria-hidden');
    });

    it('should keep previous aria-hidden siblings hidden', () => {
      const modal = { modalRef: container2.children[0] as HTMLElement };
      const sibling1 = document.createElement('div');
      const sibling2 = document.createElement('div');

      sibling1.setAttribute('aria-hidden', 'true');

      container2.appendChild(sibling1);
      container2.appendChild(sibling2);

      modalManager.add(modal, container2);
      modalManager.mount(modal, {});
      expect(container2.children[0]).not.toHaveAttribute('aria-hidden');

      modalManager.remove(modal);

      expect(container2.children[0]).toHaveAttribute('aria-hidden');
      expect(container2.children[1]).toHaveAttribute('aria-hidden');
      expect(container2.children[2]).not.toHaveAttribute('aria-hidden');
    });
  });
});
