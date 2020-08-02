import React from 'react';
import { render, cleanup, RenderResult } from '@testing-library/react';

import { Collapse } from '../Collapse';

import '@testing-library/jest-dom/extend-expect';

describe('<Collapse />', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();

    cleanup();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render a container around the wrapper', () => {
    const { container } = render(
      <Collapse in className="woofCollapse1">
        <div />
      </Collapse>,
    );

    expect(container.firstChild!.nodeName).toBe('DIV');
    expect(container.firstChild).toHaveClass('woofCollapse1');
  });

  describe('transition lifecycle', () => {
    let wrapper: RenderResult;

    /* We needs to create wrappers here because the node is passed by reference
       and it's style is overwritten by the later stages */
    const handleEnter = jest.fn();
    const handleEntering = jest.fn();
    const handleEntered = jest.fn();
    const handleExit = jest.fn();

    const handleExiting = jest.fn();
    const handleExited = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <Collapse
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <div data-testid="test">123</div>
        </Collapse>,
      );
    });

    describe('in', () => {
      beforeEach(() => {
        wrapper.rerender(
          <Collapse
            in
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test">123</div>
          </Collapse>,
        );
      });

      describe('handleEnter()', () => {
        it('should call handleEnter', () => {
          expect(handleEnter).toBeCalledTimes(1);
          expect(handleEnter).toBeCalledWith(wrapper.container.firstChild, false);
        });
      });

      describe('handleEntering()', () => {
        it('should call handleEntering', () => {
          expect(handleEntering).toBeCalledTimes(1);
          expect(handleEntering).toBeCalledWith(wrapper.container.firstChild, false);
        });
      });

      describe('handleEntered()', () => {
        it('should set height to auto', () => {
          jest.advanceTimersByTime(1000);

          expect(handleEntered.mock.calls[0][0].style.height).toBe('auto');
        });

        it('should have called onEntered', () => {
          jest.advanceTimersByTime(1000);

          expect(handleEntered).toBeCalledTimes(1);
          expect(handleEntered).toBeCalledWith(wrapper.container.firstChild, false);
        });
      });
    });

    describe('out', () => {
      beforeEach(() => {
        wrapper.rerender(
          <Collapse
            in
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test">123</div>
          </Collapse>,
        );

        wrapper.rerender(
          <Collapse
            in={false}
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test">123</div>
          </Collapse>,
        );
      });

      describe('handleExit()', () => {
        it('should call onExit', () => {
          expect(handleExit).toBeCalledTimes(1);
          expect(handleExit).toBeCalledWith(wrapper.container.firstChild);
        });
      });

      describe('handleExiting()', () => {
        it('should call onExiting', () => {
          expect(handleExiting).toBeCalledTimes(1);
          expect(handleExiting).toBeCalledWith(wrapper.container.firstChild);
        });
      });

      describe('handleExited()', () => {
        it('should call onExited', () => {
          jest.advanceTimersByTime(1000);

          expect(handleExiting).toBeCalledTimes(1);
          expect(handleExiting).toBeCalledWith(wrapper.container.firstChild);
        });
      });
    });
  });

  describe('prop: collapsedSize', () => {
    const collapsedSize = '10px';

    it('height: should work when closed', () => {
      const { container } = render(
        <Collapse in collapsedSize={collapsedSize}>
          <div />
        </Collapse>,
      );

      expect(container.firstChild).toHaveStyle(`min-height: ${collapsedSize}`);
    });

    it('width: should work when closed', () => {
      const { container } = render(
        <Collapse in collapsedSize={collapsedSize} orientation="horizontal">
          <div />
        </Collapse>,
      );

      expect(container.firstChild).toHaveStyle(`min-width: ${collapsedSize}`);
    });

    it('should be taken into account in handleExiting', () => {
      const handleExiting = jest.fn();
      const { rerender } = render(
        <Collapse in collapsedSize={collapsedSize} onExiting={handleExiting}>
          <div />
        </Collapse>,
      );

      rerender(
        <Collapse in={false} collapsedSize={collapsedSize} onExiting={handleExiting}>
          <div />
        </Collapse>,
      );

      expect(handleExiting.mock.calls[0][0].style.height).toBe(collapsedSize);
    });
  });

  it('should create proper easeOut animation onEntering', () => {
    const handleEntering = jest.fn();

    const { rerender } = render(
      <Collapse
        onEntering={handleEntering}
        timeout={{
          enter: 556,
        }}
      >
        <div />
      </Collapse>,
    );

    rerender(
      <Collapse
        in
        onEntering={handleEntering}
        timeout={{
          enter: 556,
        }}
      >
        <div />
      </Collapse>,
    );

    expect(handleEntering.mock.calls[0][0].style.transitionDuration).toBe('556ms');
  });

  it('should create proper sharp animation onExiting', () => {
    const handleExiting = jest.fn();

    const { rerender } = render(
      <Collapse
        in
        onExiting={handleExiting}
        timeout={{
          exit: 446,
        }}
      >
        <div />
      </Collapse>,
    );

    rerender(
      <Collapse
        in={false}
        onExiting={handleExiting}
        timeout={{
          exit: 446,
        }}
      >
        <div />
      </Collapse>,
    );

    expect(handleExiting.mock.calls[0][0].style.transitionDuration).toBe('446ms');
  });

  it('should use timeout as delay when timeout is number', () => {
    const timeout = 10;
    const next = jest.fn();
    const { rerender } = render(
      <Collapse timeout={timeout} onEntered={next}>
        <div />
      </Collapse>,
    );

    rerender(
      <Collapse in timeout={timeout} onEntered={next}>
        <div />
      </Collapse>,
    );

    expect(next).not.toHaveBeenCalled();

    jest.advanceTimersByTime(0);
    expect(next).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
