import React from 'react';
import { render, cleanup } from '@testing-library/react';

import { NoSsr } from '../NoSsr';

// TODO: Need testing in server environment

describe('<NoSsr />', () => {
  afterEach(cleanup);

  describe('mounted', () => {
    it('should render the children', () => {
      const { getByTestId } = render(
        <NoSsr>
          <span data-testid="client" />
        </NoSsr>,
      );

      expect(getByTestId('client')).toBeDefined();
    });
  });

  describe('prop: defer', () => {
    it('should defer the rendering', () => {
      const { getByTestId } = render(
        <NoSsr defer>
          <span data-testid="client" />
        </NoSsr>,
      );

      expect(getByTestId('client')).toBeDefined();
    });
  });
});
