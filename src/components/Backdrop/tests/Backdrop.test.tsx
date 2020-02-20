import React from 'react';
import { render } from '@testing-library/react';

import { Backdrop } from '../Backdrop';

describe('<Backdrop />', () => {
  it('should render a backdrop div with content of nested children', () => {
    const { getByTestId } = render(
      <Backdrop open className="woofBackdrop">
        <h1 data-testid="child">Hello World</h1>
      </Backdrop>,
    );

    expect(getByTestId('child')).toBeTruthy();
  });
});
