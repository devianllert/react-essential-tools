/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';

import { Modal } from '../Modal';

import '@testing-library/jest-dom/extend-expect';

describe('<Modal />', () => {
  let container: HTMLDivElement;

  beforeAll(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterAll(() => {
    document.body.removeChild(container);
  });

  describe('prop: open', () => {
    it('should not render the children by default', () => {
      const { queryByTestId } = render(
        <Modal open={false}>
          <p data-testid="content">Hello World</p>
        </Modal>,
      );

      expect(queryByTestId('content')).toBeNull();
    });
  });

  describe('backdrop', () => {
    // it('should render a backdrop with a fade transition', () => {
    //   const wrapper = render(modal);
    // });

    it('should attach a handler to the backdrop that fires onClose', () => {
      const onClose = jest.fn();
      const { getByRole } = render(
        <Modal open onClose={onClose}>
          <div id="container">
            <h1 id="heading">Hello</h1>
          </div>
        </Modal>,
      );

      const backdrop = getByRole('presentation').firstChild;

      fireEvent.click(backdrop as Element);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should let the user disable backdrop click triggering onClose', () => {
      const onClose = jest.fn();
      const { getByRole } = render(
        <Modal open onClose={onClose} disableBackdropClick>
          <div id="container">
            <h1 id="heading">Hello</h1>
          </div>
        </Modal>,
      );

      const backdrop = getByRole('presentation').firstChild;

      fireEvent.click(backdrop as Element);
      expect(onClose).toHaveBeenCalledTimes(0);
    });

    it('should call through to the user specified onBackdropClick callback', () => {
      const onBackdropClick = jest.fn();

      const { getByRole } = render(
        <Modal open onBackdropClick={onBackdropClick} disableBackdropClick>
          <div id="container">
            <h1 id="heading">Hello</h1>
          </div>
        </Modal>,
      );

      const backdrop = getByRole('presentation').firstChild;

      fireEvent.click(backdrop as Element);
      expect(onBackdropClick).toHaveBeenCalledTimes(1);
    });

    it('should ignore the backdrop click if the event did not come from the backdrop', () => {
      const onBackdropClick = jest.fn();

      const { getByTestId } = render(
        <Modal
          open
          onBackdropClick={onBackdropClick}
          BackdropComponent={(props: any) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <div {...props}>
              <span data-testid="backdrop-child" />
            </div>
          )}
        >
          <div id="container">
            <h1 id="heading">Hello</h1>
          </div>
        </Modal>,
      );

      const backdropChild = getByTestId('backdrop-child');

      fireEvent.click(backdropChild);

      expect(onBackdropClick).toHaveBeenCalledTimes(0);
    });
  });

  describe('render', () => {
    let wrapper: RenderResult;

    beforeEach(() => {
      wrapper = render(
        <Modal open={false} id="modal">
          <div data-testid="container">
            <h1 data-testid="heading">Hello</h1>
          </div>
        </Modal>,
      );
    });

    it('should not render the content', () => {
      expect(wrapper.queryByTestId('container')).toBeNull();
      expect(wrapper.queryByTestId('heading')).toBeNull();
    });

    it('should render the content into the portal', () => {
      wrapper.rerender(
        <Modal open id="modal">
          <div data-testid="container">
            <h1 data-testid="heading">Hello</h1>
          </div>
        </Modal>,
      );

      const portalLayer = wrapper.getByRole('presentation');
      const modalContainer = wrapper.getByTestId('container');
      const heading = wrapper.getByTestId('heading');

      expect(modalContainer.tagName).toBe('DIV');
      expect(heading.tagName).toBe('H1');
      expect(portalLayer.contains(modalContainer)).toBeTruthy();
      expect(portalLayer.contains(heading)).toBeTruthy();

      const modalContainer2 = wrapper.getByTestId('container');

      expect(modalContainer2).not.toHaveAttribute('role');
      expect(modalContainer2).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('hide backdrop', () => {
    it('should not render a backdrop component into the portal before the modal content', () => {
      const { getByTestId } = render(
        <Modal open hideBackdrop data-testid="modal">
          <div data-testid="container">
            <h1 data-testid="heading">Hello</h1>
          </div>
        </Modal>,
      );
      const modal = getByTestId('modal');
      const modalContainer = getByTestId('container');


      expect(modal.children).toHaveLength(3);
      expect(modal.children[1]).toEqual(modalContainer);
    });
  });

  describe('handleKeyDown()', () => {
    let wrapper: RenderResult;
    let onEscapeKeyDownSpy: jest.Mock;
    let onCloseSpy: jest.Mock;
    let modalWrapper: HTMLElement;

    beforeEach(() => {
      onEscapeKeyDownSpy = jest.fn();
      onCloseSpy = jest.fn();
      wrapper = render(
        <Modal open onEscapeKeyDown={onEscapeKeyDownSpy} onClose={onCloseSpy}>
          <div />
        </Modal>,
      );
      modalWrapper = wrapper.getByRole('presentation');
    });

    it('when mounted, TopModal and event not esc should not call given functions', () => {
      fireEvent.keyDown(modalWrapper, {
        key: 'j',
      });

      expect(onEscapeKeyDownSpy).toHaveBeenCalledTimes(0);
      expect(onCloseSpy).toHaveBeenCalledTimes(0);
    });

    it('should call onEscapeKeyDown and onClose', () => {
      fireEvent.keyDown(modalWrapper, {
        key: 'Escape',
      });

      expect(onEscapeKeyDownSpy).toHaveBeenCalledTimes(1);
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('when disableEscapeKeyDown should call only onClose', () => {
      wrapper.rerender(
        <Modal disableEscapeKeyDown open onEscapeKeyDown={onEscapeKeyDownSpy} onClose={onCloseSpy}>
          <div />
        </Modal>,
      );

      fireEvent.keyDown(modalWrapper, {
        key: 'Escape',
      });

      expect(onEscapeKeyDownSpy).toHaveBeenCalledTimes(1);
      expect(onCloseSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('focus', () => {
    let initialFocus: HTMLDivElement;
    let wrapper: RenderResult;

    beforeEach(() => {
      initialFocus = document.createElement('div');
      initialFocus.tabIndex = 0;
      initialFocus.className = 'initial-focus';
      document.body.appendChild(initialFocus);

      // @ts-ignore
      initialFocus.focus();
    });

    afterEach(() => {
      wrapper.unmount();
      document.body.removeChild(initialFocus);
    });

    it('should focus on the modal when it is opened', () => {
      wrapper = render(
        <Modal open>
          <div className="modal">Foo</div>
        </Modal>,
      );

      expect(document.activeElement?.className).toBe('modal');

      wrapper.rerender(
        <Modal open={false}>
          <div className="modal">Foo</div>
        </Modal>,
      );

      expect(document.activeElement).toEqual(initialFocus);
    });

    it('should support autoFocus', () => {
      wrapper = render(
        <Modal open>
          <div className="modal">
            <input
              type="text"
              autoFocus
            />
          </div>
        </Modal>,
      );

      expect(document.activeElement?.tagName).toBe('INPUT');

      wrapper.rerender(
        <Modal open={false}>
          <div className="modal">
            <input
              type="text"
              autoFocus
            />
          </div>
        </Modal>,
      );

      expect(document.activeElement).toEqual(initialFocus);
    });

    it('should keep focus on the modal when it is closed', () => {
      wrapper = render(
        <Modal open disableRestoreFocus>
          <div className="modal">Foo</div>
        </Modal>,
      );

      expect(document.activeElement?.className).toBe('modal');

      wrapper.rerender(
        <Modal open={false} disableRestoreFocus>
          <div className="modal">Foo</div>
        </Modal>,
      );

      expect(document.activeElement?.tagName).toBe('BODY');
    });

    it('should not focus on the modal when disableAutoFocus is true', () => {
      wrapper = render(
        <Modal open disableAutoFocus>
          <div>Foo</div>
        </Modal>,
      );

      expect(document.activeElement).toEqual(initialFocus);
    });

    it('should return focus to the modal', () => {
      wrapper = render(
        <Modal open>
          <div className="modal">
            <input
              data-testid="input"
              autoFocus
            />
          </div>
        </Modal>,
      );

      expect(document.activeElement).toEqual(wrapper.getByTestId('input'));

      // @ts-ignore
      initialFocus.focus();

      expect(document.activeElement?.className).toBe('modal');
    });

    it('should not return focus to the modal when disableEnforceFocus is true', () => {
      wrapper = render(
        <Modal open disableEnforceFocus>
          <div className="modal">
            <input data-testid="input" autoFocus />
          </div>
        </Modal>,
      );

      expect(document.activeElement).toEqual(wrapper.getByTestId('input'));

      // @ts-ignore
      initialFocus.focus();

      expect(document.activeElement).toEqual(initialFocus);
    });
  });

  describe('prop: disablePortal', () => {
    it('should render the content into the parent', () => {
      const { getByTestId } = render(
        <div data-testid="parent">
          <Modal open disablePortal>
            <div data-testid="child" />
          </Modal>
        </div>,
      );

      expect(getByTestId('parent').contains(getByTestId('child'))).toBeTruthy();
    });
  });
});
