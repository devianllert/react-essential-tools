/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { Popper } from '../Popper';

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

describe('<Popper />', () => {
  afterEach(cleanup);

  const defaultProps = {
    anchorEl: (): HTMLElement => window.document.createElement('svg'),
    children: <span>Hello World</span>,
    open: true,
  };

  it('should have top placement', () => {
    const place = jest.fn((placement: string) => placement);

    render(
      <Popper
        anchorEl={defaultProps.anchorEl}
        open={defaultProps.open}
        placement="top"
      >
        {({ placement }: any): null => {
          place(placement);
          return null;
        }}
      </Popper>,
    );

    expect(place).toHaveBeenCalledTimes(1);
    expect(place.mock.calls[0][0]).toEqual('top');
  });

  describe('prop: open', () => {
    it('should open without any issue', () => {
      const { queryByRole, getByRole, rerender } = render(
        <Popper
          anchorEl={defaultProps.anchorEl}
          open={false}
        >
          {defaultProps.children}
        </Popper>,
      );

      expect(queryByRole('tooltip')).toBeNull();

      rerender(
        <Popper
          anchorEl={defaultProps.anchorEl}
          open={defaultProps.open}
        >
          {defaultProps.children}
        </Popper>,
      );

      expect(getByRole('tooltip')).toBeDefined();
      expect(getByRole('tooltip').textContent).toEqual('Hello World');
    });

    it('should close without any issue', () => {
      const { queryByRole, getByRole, rerender } = render(
        <Popper
          anchorEl={defaultProps.anchorEl}
          open={defaultProps.open}
        >
          {defaultProps.children}
        </Popper>,
      );

      expect(getByRole('tooltip')).toBeDefined();
      expect(getByRole('tooltip').textContent).toEqual('Hello World');

      rerender(
        <Popper
          anchorEl={defaultProps.anchorEl}
          open={false}
        >
          {defaultProps.children}
        </Popper>,
      );

      expect(queryByRole('tooltip')).toBeNull();
    });
  });
});
