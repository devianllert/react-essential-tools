import React from 'react';
import { render, cleanup, RenderResult } from '@testing-library/react';

import { Fade } from '../Fade';

import '@testing-library/jest-dom/extend-expect';

describe('<Fade />', () => {
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
        <Fade
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <div data-testid="test" />
        </Fade>,
      );
    });

    describe('in', () => {
      beforeEach(() => {
        wrapper.rerender(
          <Fade
            in
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Fade>,
        );
      });

      describe('handleEnter()', () => {
        it('should call handleEnter()', () => {
          expect(handleEnter).toBeCalledTimes(1);
          expect(handleEnter).toBeCalledWith(wrapper.getByTestId('test'), false);
        });

        it('should set style properties', () => {
          expect(handleEnter.mock.calls[0][0].style.transition)
            .toMatch(/opacity 225ms cubic-bezier\(0.4, 0, 0.2, 1\)( 0ms)?/);
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
          <Fade
            in
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Fade>,
        );

        wrapper.rerender(
          <Fade
            in={false}
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Fade>,
        );
      });

      describe('handleExit()', () => {
        it('should call handleExit()', () => {
          expect(handleExit).toBeCalledTimes(1);
          expect(handleExit).toBeCalledWith(wrapper.getByTestId('test'));
        });

        it('should set style properties', () => {
          expect(handleExit.mock.calls[0][0].style.transition)
            .toMatch(/opacity 195ms cubic-bezier\(0.4, 0, 0.2, 1\)( 0ms)?/);
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

  describe('prop: appear', () => {
    it('should work when initially hidden, appear=true', () => {
      const { container } = render(
        <Fade in={false} appear>
          <div>Foo</div>
        </Fade>,
      );

      expect(container.firstChild).toHaveStyle('opacity: 0; visibility: hidden');
    });

    it('should work when initially hidden, appear=false', () => {
      const { container } = render(
        <Fade in={false} appear={false}>
          <div>Foo</div>
        </Fade>,
      );

      expect(container.firstChild).toHaveStyle('opacity: 0; visibility: hidden');
    });
  });
});
