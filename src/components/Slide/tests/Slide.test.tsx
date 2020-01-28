import React from 'react';
import { render, cleanup, RenderResult } from '@testing-library/react';

import { Slide } from '../Slide';

import '@testing-library/jest-dom/extend-expect';

describe('<Slide />', () => {
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

  it('should not override children styles', () => {
    const { getByTestId } = render(
      <Slide in direction="down" style={{ color: 'red', backgroundColor: 'yellow' }}>
        <div data-testid="test" style={{ color: 'blue' }} />
      </Slide>,
    );

    expect(getByTestId('test')).toHaveStyle('background-color: yellow; color: blue');
  });

  describe('transition lifecycle', () => {
    let wrapper: RenderResult;

    const handleEnter = jest.fn();
    const handleEntering = jest.fn();
    const handleEntered = jest.fn();
    const handleExit = jest.fn();
    const handleExiting = jest.fn();
    const handleExited = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <Slide
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <div data-testid="test" />
        </Slide>,
      );
    });

    describe('in', () => {
      beforeEach(() => {
        wrapper.rerender(
          <Slide
            in
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Slide>,
        );
      });

      describe('handleEnter()', () => {
        it('should call handleEnter()', () => {
          expect(handleEnter).toBeCalledTimes(1);
          expect(handleEnter).toBeCalledWith(wrapper.getByTestId('test'), false);
        });
      });

      describe('handleEntering()', () => {
        it('should reset the translate3d', () => {
          expect(handleEnter.mock.calls[0][0].style.transform).toMatch(/none/);
        });

        it('should call handleEntering()', () => {
          expect(handleEntering).toBeCalledTimes(1);
          expect(handleEntering).toBeCalledWith(wrapper.getByTestId('test'), false);
        });
      });

      describe('handleEntered()', () => {
        it('should call handleEntered()', () => {
          jest.advanceTimersByTime(1000);

          expect(handleEntered).toBeCalledTimes(1);
          expect(handleEntered).toBeCalledWith(wrapper.getByTestId('test'), false);
        });
      });
    });

    describe('out', () => {
      beforeEach(() => {
        wrapper.rerender(
          <Slide
            in
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Slide>,
        );

        wrapper.rerender(
          <Slide
            in={false}
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Slide>,
        );
      });

      describe('handleExit()', () => {
        it('should call handleExit()', () => {
          expect(handleExit).toBeCalledTimes(1);
          expect(handleExit).toBeCalledWith(wrapper.getByTestId('test'));
        });
      });

      describe('handleExiting()', () => {
        it('should call handleExiting()', () => {
          expect(handleExiting).toBeCalledTimes(1);
          expect(handleExiting).toBeCalledWith(wrapper.getByTestId('test'));
        });
      });

      describe('handleExited()', () => {
        it('should call handleExited()', () => {
          jest.advanceTimersByTime(1000);

          expect(handleExited).toBeCalledTimes(1);
          expect(handleExited).toBeCalledWith(wrapper.getByTestId('test'));
        });
      });
    });
  });

  describe('prop: timeout', () => {
    let wrapper: RenderResult;
    const enterDuration = 556;
    const leaveDuration = 446;
    const handleEntering = jest.fn();
    const handleExit = jest.fn();

    beforeEach(() => {
      wrapper = render(
        <Slide
          in
          direction="down"
          timeout={{
            enter: enterDuration,
            exit: leaveDuration,
          }}
          onEntering={handleEntering}
          onExit={handleExit}
        >
          <div data-testid="test" />
        </Slide>,
      );
    });

    it('should create proper easeOut animation onEntering', () => {
      expect(handleEntering.mock.calls[0][0].style.transition).toMatch(
        /transform 556ms cubic-bezier\(0(.0)?, 0, 0.2, 1\)( 0ms)?/,
      );
    });

    it('should create proper sharp animation onExit', () => {
      wrapper.rerender(
        <Slide
          in={false}
          direction="down"
          timeout={{
            enter: enterDuration,
            exit: leaveDuration,
          }}
          onEntering={handleEntering}
          onExit={handleExit}
        >
          <div data-testid="test" />
        </Slide>,
      );

      expect(handleExit.mock.calls[0][0].style.transition).toMatch(
        /transform 446ms cubic-bezier\(0.4, 0, 0.6, 1\)( 0ms)?/,
      );
    });
  });

  describe('prop: direction', () => {
    it('should update the position', () => {
      const { rerender, getByTestId } = render(
        <Slide in={false} direction="left">
          <div data-testid="test" />
        </Slide>,
      );
      const child = getByTestId('test');

      const transition1 = child.style.transform;

      rerender(
        <Slide in={false} direction="right">
          <div data-testid="test" />
        </Slide>,
      );

      const transition2 = child.style.transform;

      expect(transition1).not.toEqual(transition2);
    });
  });

  describe('mount', () => {
    it('should work when initially hidden', () => {
      const { getByTestId } = render(
        <Slide in={false}>
          <div data-testid="test">Foo</div>
        </Slide>,
      );
      const child = getByTestId('test');


      expect(child.style.visibility).toEqual('hidden');
      expect(child.style.transform).not.toBeUndefined();
    });
  });

  describe('resize', () => {
    it('should recompute the correct position', () => {
      const { getByTestId } = render(
        <Slide direction="up" in={false}>
          <div data-testid="test">Foo</div>
        </Slide>,
      );

      window.dispatchEvent(new window.Event('resize', {}));

      jest.advanceTimersByTime(166);

      const child = getByTestId('test');

      expect(child.style.transform).not.toBeUndefined();
    });

    it('should do nothing when visible', () => {
      render(<Slide in direction="down"><div data-testid="test">Foo</div></Slide>);
      window.dispatchEvent(new window.Event('resize', {}));
      jest.advanceTimersByTime(166);
    });
  });

  describe('server-side', () => {
    it('should be initially hidden', () => {
      const { getByTestId } = render(
        <Slide direction="down" in={false}>
          <div data-testid="test" />
        </Slide>,
      );

      expect(getByTestId('test')).toHaveStyle('visibility: hidden');
    });
  });
});
