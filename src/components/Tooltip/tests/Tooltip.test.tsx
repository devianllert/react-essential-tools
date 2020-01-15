/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  act,
} from '@testing-library/react';

import { Tooltip } from '../Tooltip';

import '@testing-library/jest-dom/extend-expect';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class {
    static placements = PopperJS.placements;

    constructor() {
      return {
        update: (): void => {},
        destroy: (): void => {},
        scheduleUpdate: (): void => {},
      };
    }
  };
});

jest.useFakeTimers();

describe('<Tooltip />', () => {
  afterEach(cleanup);

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

    expect(getByTestId('children')).toBeDefined();
    expect(getByTestId('children')).toHaveAttribute('title', 'test tooltip');
    expect(getByTestId('children')).toHaveTextContent('Hello World');
  });

  it('should render tooltip when hover', () => {
    const { getByTestId } = render(
      <Tooltip title={defaultProps.title}>
        {defaultProps.children}
      </Tooltip>,
    );

    expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();

    fireEvent.mouseOver(getByTestId('children'));

    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();
    expect(document.querySelector('[role="tooltip"]')).toHaveTextContent('test tooltip');
  });

  it('should unmount tooltip when mouse leave', () => {
    const { getByTestId } = render(
      <Tooltip title={defaultProps.title}>
        {defaultProps.children}
      </Tooltip>,
    );

    expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();

    fireEvent.mouseOver(getByTestId('children'));

    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();

    fireEvent.mouseLeave(getByTestId('children'));

    act(() => {
      jest.runAllTimers();
    });

    expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();
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
      render(
        <Tooltip title={defaultProps.title} open>
          {defaultProps.children}
        </Tooltip>,
      );

      expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();
    });

    it('should not display if the title is an empty string', () => {
      render(
        <Tooltip title="" open>
          {defaultProps.children}
        </Tooltip>,
      );

      expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();
    });

    it('should be passed down to the child as a native title', () => {
      const { getByRole } = render(
        <Tooltip title="Hello World">
          <button type="submit">Hello World</button>
        </Tooltip>,
      );

      expect(getByRole('button').getAttribute('title')).toEqual('Hello World');
    });
  });

  describe('touch screen', () => {
    it('should not respond to quick events', () => {
      const { getByTestId } = render(
        <Tooltip title={defaultProps.title}>
          {defaultProps.children}
        </Tooltip>,
      );
      const children = getByTestId('children');

      fireEvent.touchStart(children);
      fireEvent.touchEnd(children);

      expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();
    });

    it('should open on long press', () => {
      const { getByTestId } = render(
        <Tooltip title={defaultProps.title}>
          {defaultProps.children}
        </Tooltip>,
      );

      const children = getByTestId('children');

      fireEvent.touchStart(children);

      jest.advanceTimersByTime(1000);
      expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();

      fireEvent.touchEnd(children);
      fireEvent.blur(children);

      jest.advanceTimersByTime(1500);
      expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();
    });
  });

  describe('prop: interactive', () => {
    it('should keep the overlay open if the popper element is hovered', () => {
      const { getByTestId } = render(
        <Tooltip title="Hello World" interactive leaveDelay={111}>
          <button data-testid="button" type="submit">
            Hello World
          </button>
        </Tooltip>,
      );

      const children = getByTestId('button');

      fireEvent.mouseOver(children);
      jest.advanceTimersByTime(0);

      expect(document.querySelector('[role="tooltip"]')!).toBeInTheDocument();

      fireEvent.mouseLeave(children);
      expect(document.querySelector('[role="tooltip"]')!).toBeInTheDocument();

      fireEvent.mouseOver(document.querySelector('[role="tooltip"]')!);

      jest.advanceTimersByTime(111);

      expect(document.querySelector('[role="tooltip"]')!).toBeInTheDocument();
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

      expect(document.querySelector('[role="tooltip"]')).toMatchSnapshot();
    });
  });
});
