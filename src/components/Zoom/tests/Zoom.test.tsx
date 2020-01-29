import React from 'react';
import { render, cleanup, RenderResult } from '@testing-library/react';

import { Zoom } from '../Zoom';

import '@testing-library/jest-dom/extend-expect';

describe('<Zoom />', () => {
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
        <Zoom
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <div data-testid="test" />
        </Zoom>,
      );
    });

    describe('in', () => {
      beforeEach(() => {
        wrapper.rerender(
          <Zoom
            in
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Zoom>,
        );
      });

      describe('handleEnter()', () => {
        it('should call handleEnter()', () => {
          expect(handleEnter).toBeCalledTimes(1);
          expect(handleEnter).toBeCalledWith(wrapper.getByTestId('test'), false);
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
          <Zoom
            in
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Zoom>,
        );

        wrapper.rerender(
          <Zoom
            in={false}
            onEnter={handleEnter}
            onEntering={handleEntering}
            onEntered={handleEntered}
            onExit={handleExit}
            onExiting={handleExiting}
            onExited={handleExited}
          >
            <div data-testid="test" />
          </Zoom>,
        );
      });

      describe('handleExit()', () => {
        it('should call handleExit()', () => {
          expect(handleExit).toBeCalledTimes(1);
          expect(handleExit).toBeCalledWith(wrapper.getByTestId('test'));
        });

        it('should set style properties', () => {
          expect(handleExit.mock.calls[0][0].style.transition)
            .toMatch(/transform 195ms cubic-bezier\(0.4, 0, 0.2, 1\)( 0ms)?/);
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
    it('should work when initially hidden: appear=true', () => {
      const { getByTestId } = render(
        <Zoom in={false} appear>
          <div data-testid="children">Foo</div>
        </Zoom>,
      );

      expect(getByTestId('children')).toHaveStyle('transform: scale(0); visibility: hidden');
    });

    it('should work when initially hidden: appear=false', () => {
      const { getByTestId } = render(
        <Zoom in={false} appear={false}>
          <div data-testid="children">Foo</div>
        </Zoom>,
      );

      expect(getByTestId('children')).toHaveStyle('transform: scale(0); visibility: hidden');
    });
  });
});
