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

    expect(getByTestId('children').hasAttribute('title')).toBeTruthy();
    expect(getByTestId('children').getAttribute('title')).toEqual('test tooltip');

    expect(getByTestId('children').textContent).toEqual('Hello World');
  });

  it('should render tooltip when hover', () => {
    const { getByTestId } = render(
      <Tooltip title={defaultProps.title}>
        {defaultProps.children}
      </Tooltip>,
    );

    expect(document.querySelector('[role="tooltip"]')).not.toBeInTheDocument();


    act(() => {
      fireEvent.mouseOver(getByTestId('children'));
    });

    expect(document.querySelector('[role="tooltip"]')).toBeInTheDocument();
    expect(document.querySelector('[role="tooltip"]')!.textContent).toEqual('test tooltip');
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
