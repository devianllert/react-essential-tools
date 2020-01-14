import React, { ReactElement } from 'react';
import { render, cleanup, RenderResult } from '@testing-library/react';

import { useForkRef } from '../../../utils/useForkRef';
import { getAutoHeightDuration } from '../../../utils/transitions';

import { Grow } from '../Grow';

describe('<Grow />', () => {
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
        <Grow
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <div test-id="test" />
        </Grow>,
      );
    });

    describe('in', () => {
      beforeEach(() => {
        wrapper.rerender(
          <Grow
            in
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Grow>,
        );
      });

      describe('handleEnter()', () => {
        it('should call handleEnter()', () => {
          expect(handleEnter).toBeCalledTimes(1);
          expect(handleEnter).toBeCalledWith(wrapper.getByTestId('test'), false);
        });

        it('should set style properties', () => {
          expect(handleEnter.mock.calls[0][0].style.transition)
            // eslint-disable-next-line max-len
            .toMatch(/opacity (0ms )?cubic-bezier\(0.4, 0, 0.2, 1\)( 0ms)?,( )?transform (0ms )?cubic-bezier\(0.4, 0, 0.2, 1\)( 0ms)?/);
        });
      });

      describe('handleEntering()', () => {
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
          <Grow
            in
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Grow>,
        );

        wrapper.rerender(
          <Grow
            in={false}
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Grow>,
        );
      });

      describe('handleExit()', () => {
        it('should call handleExit()', () => {
          expect(handleExit).toBeCalledTimes(1);
          expect(handleExit).toBeCalledWith(wrapper.getByTestId('test'));
        });

        it('should set style properties', () => {
          expect(handleExit.mock.calls[0][0].style.opacity).toEqual('0');
          expect(handleExit.mock.calls[0][0].style.transform).toEqual('scale(0.75, 0.5625)');
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
    const enterDuration = 556;
    const leaveDuration = 446;

    describe('onEnter', () => {
      it('should create proper easeOut animation', () => {
        const handleEnter = jest.fn();
        render(
          <Grow
            in
            timeout={{
              enter: enterDuration,
              exit: leaveDuration,
            }}
            onEnter={handleEnter}
          >
            <div />
          </Grow>,
        );

        expect(handleEnter.mock.calls[0][0].style.transition).toMatch(new RegExp(`${enterDuration}ms`));
      });

      it('should delay based on height when timeout is auto', () => {
        const handleEntered = jest.fn();

        const height = 10;
        const autoTransitionDuration = getAutoHeightDuration(height);
        // eslint-disable-next-line prefer-arrow-callback
        const FakeDiv = React.forwardRef<HTMLDivElement>(function FakeDiv(props, ref) {
          const divRef = React.useRef(null);
          const handleRef = useForkRef(ref, divRef);

          React.useEffect(() => {
            // For jsdom
            Object.defineProperty(divRef.current, 'clientHeight', {
              value: height,
            });
          });

          return (
            <div
              ref={handleRef}
              style={{
                height,
              }}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          );
        });

        function MyTest(props: any): ReactElement {
          return (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Grow timeout="auto" onEntered={handleEntered} {...props}>
              <FakeDiv />
            </Grow>
          );
        }

        const wrapper = render(<MyTest />);
        wrapper.rerender(<MyTest in />);

        expect(handleEntered).toHaveBeenCalledTimes(0);
        jest.advanceTimersByTime(0);
        expect(handleEntered).toHaveBeenCalledTimes(0);
        jest.advanceTimersByTime(autoTransitionDuration);
        expect(handleEntered).toHaveBeenCalledTimes(1);

        const handleEntered2 = jest.fn();

        render(
          <Grow in timeout="auto" onEntered={handleEntered2}>
            <div />
          </Grow>,
        );

        expect(handleEntered2).toHaveBeenCalledTimes(0);
        jest.advanceTimersByTime(0);
        expect(handleEntered2).toHaveBeenCalledTimes(1);
      });

      it('should use timeout as delay when timeout is number', () => {
        const timeout = 10;
        const handleEntered = jest.fn();
        render(<Grow in timeout={timeout} onEntered={handleEntered}><div /></Grow>);

        expect(handleEntered).not.toHaveBeenCalled();
        jest.advanceTimersByTime(0);
        expect(handleEntered).not.toHaveBeenCalled();
        jest.advanceTimersByTime(timeout);
        expect(handleEntered).toHaveBeenCalledTimes(1);
      });
    });

    describe('onExit', () => {
      it('should delay based on height when timeout is auto', () => {
        const handleExited = jest.fn();
        const wrapper = render(
          <Grow in timeout="auto" onExited={handleExited}>
            <div />
          </Grow>,
        );

        jest.advanceTimersByTime(0);

        wrapper.rerender(
          <Grow in={false} timeout="auto" onExited={handleExited}>
            <div />
          </Grow>,
        );

        expect(handleExited).not.toHaveBeenCalled();
        jest.advanceTimersByTime(0);
        expect(handleExited).toHaveBeenCalledTimes(1);
      });

      it('should use timeout as delay when timeout is number', () => {
        const timeout = 20;
        const handleExited = jest.fn();
        const wrapper = render(<Grow in timeout={timeout} onExited={handleExited}><div /></Grow>);

        jest.advanceTimersByTime(timeout);

        wrapper.rerender(
          <Grow in={false} timeout={timeout} onExited={handleExited}>
            <div />
          </Grow>,
        );

        expect(handleExited).not.toHaveBeenCalled();
        jest.advanceTimersByTime(0);
        expect(handleExited).not.toHaveBeenCalled();
        jest.advanceTimersByTime(timeout);
        expect(handleExited).toHaveBeenCalledTimes(1);
      });

      it('should create proper sharp animation', () => {
        const handleExit = jest.fn();
        const wrapper = render(
          <Grow
            in
            timeout={{
              enter: enterDuration,
              exit: leaveDuration,
            }}
            onExit={handleExit}
          >
            <div />
          </Grow>,
        );

        wrapper.rerender(
          <Grow
            in={false}
            timeout={{
              enter: enterDuration,
              exit: leaveDuration,
            }}
            onExit={handleExit}
          >
            <div />
          </Grow>,
        );

        expect(handleExit.mock.calls[0][0].style.transition).toMatch(new RegExp(`${leaveDuration}ms`));
      });
    });
  });
});
