/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { Instance } from '@popperjs/core';

import { Tooltip, resetHystersis } from '../Tooltip';

import '@testing-library/jest-dom/extend-expect';

describe('<Tooltip />', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    resetHystersis();
    cleanup();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const defaultProps = {
    children: <span data-testid="children">Hello World</span>,
    title: 'test tooltip',
  };

  it('should render the correct structure', () => {
    const { getByTestId } = render(
      <Tooltip title={defaultProps.title}>
        {defaultProps.children}
      </Tooltip>,
    );

    const children = getByTestId('children');

    expect(children).toBeDefined();
    expect(children).toHaveAttribute('title', 'test tooltip');
    expect(children).toHaveTextContent('Hello World');
  });

  it('should render tooltip when hover', () => {
    const { getByTestId, queryByRole } = render(
      <Tooltip title={defaultProps.title}>
        {defaultProps.children}
      </Tooltip>,
    );

    expect(queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.mouseOver(getByTestId('children'));

    expect(queryByRole('tooltip')).toBeInTheDocument();
    expect(queryByRole('tooltip')).toHaveTextContent('test tooltip');
  });

  it('should unmount tooltip when mouse leave', () => {
    const { getByTestId, queryByRole } = render(
      <Tooltip title={defaultProps.title}>
        {defaultProps.children}
      </Tooltip>,
    );

    expect(queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.mouseOver(getByTestId('children'));

    expect(queryByRole('tooltip')).toBeInTheDocument();

    fireEvent.mouseLeave(getByTestId('children'));

    jest.runAllTimers();

    expect(queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should ignore event from the tooltip', () => {
    const handleMouseOver = jest.fn();
    const { getByRole } = render(
      <Tooltip
        title={defaultProps.title}
        open
        interactive
      >
        <button type="submit" onMouseOver={handleMouseOver}>
          Hello World
        </button>
      </Tooltip>,
    );

    fireEvent.mouseOver(getByRole('tooltip'));

    expect(handleMouseOver).not.toHaveBeenCalled();
  });

  it('should be controllable', () => {
    const handleRequestOpen = jest.fn();
    const handleClose = jest.fn();

    const { getByTestId } = render(
      <Tooltip title={defaultProps.title} open onOpen={handleRequestOpen} onClose={handleClose}>
        {defaultProps.children}
      </Tooltip>,
    );

    const children = getByTestId('children');
    expect(handleRequestOpen).not.toHaveBeenCalled();
    expect(handleClose).not.toHaveBeenCalled();

    fireEvent.mouseOver(children);

    expect(handleRequestOpen).toHaveBeenCalledTimes(1);
    expect(handleClose).not.toHaveBeenCalled();

    fireEvent.mouseLeave(children);

    jest.runAllTimers();

    expect(handleRequestOpen).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalled();
  });

  it('should use the same popper.js instance between two renders', () => {
    const popperRef = React.createRef<Instance>();
    const { rerender } = render(
      <Tooltip
        title={defaultProps.title}
        open
        PopperProps={{
          popperRef,
        }}
      >
        {defaultProps.children}
      </Tooltip>,
    );

    const firstPopperInstance = popperRef.current;

    rerender(
      <Tooltip
        title={defaultProps.title}
        open
        PopperProps={{
          popperRef,
        }}
      >
        <span>Hello World!!!</span>
      </Tooltip>,
    );
    expect(firstPopperInstance).toEqual(popperRef.current);
  });

  it('should ignore event from the tooltip', () => {
    const handleMouseOver = jest.fn();
    const { getByRole } = render(
      <Tooltip {...defaultProps} open interactive>
        <button type="submit" onMouseOver={handleMouseOver}>
          Hello World
        </button>
      </Tooltip>,
    );

    fireEvent.mouseOver(getByRole('tooltip'));

    expect(handleMouseOver).toHaveBeenCalledTimes(0);
  });

  describe('mount', () => {
    it('should mount without any issue', () => {
      render(<Tooltip title={defaultProps.title} open>{defaultProps.children}</Tooltip>);
    });
  });

  describe('prop: disableHoverListener', () => {
    it('should hide the native title', () => {
      const { getByRole } = render(
        <Tooltip title="Hello World" disableHoverListener>
          <button type="submit">Hello World</button>
        </Tooltip>,
      );

      expect(getByRole('button')).not.toHaveAttribute('title');
    });
  });

  describe('prop: title', () => {
    it('should display if the title is present', () => {
      const { getByRole } = render(
        <Tooltip title={defaultProps.title} open>
          {defaultProps.children}
        </Tooltip>,
      );

      expect(getByRole('tooltip')).toBeInTheDocument();
    });

    it('should not display if the title is an empty string', () => {
      const { queryByRole } = render(
        <Tooltip title="" open>
          {defaultProps.children}
        </Tooltip>,
      );

      expect(queryByRole('tooltip')).toBeNull();
    });

    it('should be passed down to the child as a native title', () => {
      const { getByRole } = render(
        <Tooltip title="Hello World">
          <button type="submit">Hello World</button>
        </Tooltip>,
      );

      expect(getByRole('button')).toHaveAttribute('title', 'Hello World');
    });
  });

  describe('touch screen', () => {
    it('should not respond to quick events', () => {
      const { getByTestId, queryByRole } = render(
        <Tooltip title={defaultProps.title}>
          {defaultProps.children}
        </Tooltip>,
      );
      const children = getByTestId('children');

      fireEvent.touchStart(children);
      fireEvent.touchEnd(children);

      expect(queryByRole('tooltip')).toBeNull();
    });

    it('should open on long press', () => {
      const { getByTestId, getByRole, queryByRole } = render(
        <Tooltip title={defaultProps.title}>
          {defaultProps.children}
        </Tooltip>,
      );

      const children = getByTestId('children');

      fireEvent.touchStart(children);

      jest.advanceTimersByTime(1000);
      expect(getByRole('tooltip')).toBeInTheDocument();

      fireEvent.touchEnd(children);
      fireEvent.blur(children);

      jest.advanceTimersByTime(1500);
      expect(queryByRole('tooltip')).toBeNull();
    });
  });

  describe('prop: delay', () => {
    it('should take the enterDelay into account', () => {
      const { getByTestId, queryByRole } = render(
        <Tooltip title={defaultProps.title} enterDelay={111}>
          {defaultProps.children}
        </Tooltip>,
      );

      document.dispatchEvent(new window.Event('pointerdown'));

      const children = getByTestId('children');

      document.dispatchEvent(new window.Event('keydown'));
      fireEvent.focus(children);

      expect(queryByRole('tooltip')).toBeNull();

      jest.advanceTimersByTime(111);
      expect(queryByRole('tooltip')).toBeInTheDocument();
    });

    it('should use hysteresis with the enterDelay', () => {
      const { getByTestId, queryByRole } = render(
        <Tooltip
          title={defaultProps.title}
          enterDelay={111}
          leaveDelay={5}
          TransitionProps={{ timeout: 6 }}
        >
          {defaultProps.children}
        </Tooltip>,
      );

      const children = getByTestId('children');

      fireEvent.focus(children);
      expect(queryByRole('tooltip')).toBeNull();

      jest.advanceTimersByTime(111);
      expect(queryByRole('tooltip')).toBeInTheDocument();

      fireEvent.blur(children);

      jest.advanceTimersByTime(5);
      jest.advanceTimersByTime(6);

      expect(queryByRole('tooltip')).toBeNull();

      fireEvent.focus(children);
      expect(queryByRole('tooltip')).toBeInTheDocument();
    });
  });

  describe('prop: interactive', () => {
    it('should keep the overlay open if the popper element is hovered', () => {
      const { getByTestId, getByRole } = render(
        <Tooltip title="Hello World" interactive leaveDelay={111}>
          <button data-testid="button" type="submit">
            Hello World
          </button>
        </Tooltip>,
      );

      const children = getByTestId('button');

      fireEvent.mouseOver(children);
      jest.advanceTimersByTime(0);

      expect(getByRole('tooltip')).toBeInTheDocument();

      fireEvent.mouseLeave(children);
      expect(getByRole('tooltip')).toBeInTheDocument();

      fireEvent.mouseOver(getByRole('tooltip'));

      jest.advanceTimersByTime(111);

      expect(getByRole('tooltip')).toBeInTheDocument();
    });
  });

  describe('prop: overrides', () => {
    it('should be transparent for the onMouseEnter event', () => {
      const handler = jest.fn();
      const { getByTestId } = render(
        <Tooltip title="Hello World">
          <button data-testid="button" type="submit" onMouseEnter={handler}>
            Hello World
          </button>
        </Tooltip>,
      );

      const children = getByTestId('button');

      fireEvent.mouseEnter(children);

      jest.advanceTimersByTime(0);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should be transparent for the onMouseLeave event', () => {
      const handler = jest.fn();
      const { getByTestId } = render(
        <Tooltip title="Hello World">
          <button data-testid="button" type="submit" onMouseLeave={handler}>
            Hello World
          </button>
        </Tooltip>,
      );

      const children = getByTestId('button');

      fireEvent.mouseLeave(children);

      jest.advanceTimersByTime(0);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should be transparent for the onMouseOver event', () => {
      const handler = jest.fn();
      const { getByTestId } = render(
        <Tooltip title="Hello World">
          <button data-testid="button" type="submit" onMouseOver={handler}>
            Hello World
          </button>
        </Tooltip>,
      );

      const children = getByTestId('button');

      fireEvent.mouseOver(children);

      jest.advanceTimersByTime(0);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should be transparent for the onTouchStart event', () => {
      const handler = jest.fn();
      const { getByTestId } = render(
        <Tooltip title="Hello World">
          <button data-testid="button" type="submit" onTouchStart={handler}>
            Hello World
          </button>
        </Tooltip>,
      );

      const children = getByTestId('button');

      fireEvent.touchStart(children);

      jest.advanceTimersByTime(0);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should be transparent for the onTouchEnd event', () => {
      const handler = jest.fn();
      const { getByTestId } = render(
        <Tooltip title="Hello World">
          <button data-testid="button" type="submit" onTouchEnd={handler}>
            Hello World
          </button>
        </Tooltip>,
      );

      const children = getByTestId('button');

      fireEvent.touchEnd(children);

      jest.advanceTimersByTime(0);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should be transparent for the onFocus event', () => {
      const handler = jest.fn();
      const { getByTestId } = render(
        <Tooltip title="Hello World">
          <button data-testid="button" type="submit" onFocus={handler}>
            Hello World
          </button>
        </Tooltip>,
      );

      const children = getByTestId('button');

      fireEvent.focus(children);

      jest.advanceTimersByTime(0);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should be transparent for the onBlur event', () => {
      const handler = jest.fn();
      const { getByTestId } = render(
        <Tooltip title="Hello World">
          <button data-testid="button" type="submit" onBlur={handler}>
            Hello World
          </button>
        </Tooltip>,
      );

      const children = getByTestId('button');

      fireEvent.blur(children);

      jest.advanceTimersByTime(0);

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('focus', () => {
    function Test() {
      return (
        <Tooltip enterDelay={0} leaveDelay={0} title="Some information">
          <button data-testid="target" type="button">
            Do something
          </button>
        </Tooltip>
      );
    }

    it('ignores base focus', () => {
      const { getByTestId, queryByRole } = render(<Test />);
      document.dispatchEvent(new window.Event('pointerdown'));

      expect(queryByRole('tooltip')).toBeNull();

      fireEvent.focus(getByTestId('target'));

      expect(queryByRole('tooltip')).toBeNull();
    });

    it('opens on focus-visible', () => {
      const { getByTestId, queryByRole } = render(<Test />);
      document.dispatchEvent(new window.Event('pointerdown'));

      expect(queryByRole('tooltip')).toBeNull();

      document.dispatchEvent(new window.Event('keydown'));

      fireEvent.focus(getByTestId('target'));
      expect(queryByRole('tooltip')).toBeInTheDocument();
    });
  });

  describe('snapshots', () => {
    it('should render and match the snapshot', () => {
      const { container } = render(
        <Tooltip title="Hello World" id="tooltip">
          <button type="submit">Hello World</button>
        </Tooltip>,
      );

      expect(container).toMatchSnapshot();
    });

    it('should render and match the snapshot when hovered', () => {
      const { container, getByRole } = render(
        <Tooltip title="Hello World" id="tooltip">
          <button type="submit">Hello World</button>
        </Tooltip>,
      );

      fireEvent.mouseEnter(getByRole('button'));

      expect(container).toMatchSnapshot();
    });

    it('should render and match the tooltip snapshot', () => {
      const { getByRole } = render(
        <Tooltip title="Hello World" id="tooltip">
          <button type="submit">Hello World</button>
        </Tooltip>,
      );

      fireEvent.mouseEnter(getByRole('button'));

      expect(getByRole('tooltip')).toMatchSnapshot();
    });
  });
});
