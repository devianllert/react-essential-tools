import * as React from 'react';
import { render } from '@testing-library/react';

import { Skeleton } from '../Skeleton';

import '@testing-library/jest-dom/extend-expect';

describe('<Skeleton />', () => {
  it('should match the snapshot', () => {
    const { container } = render(<Skeleton />);

    expect(container).toMatchSnapshot();
  });

  it('should change the component tag', () => {
    const { container } = render(<Skeleton component="span" />);

    expect(container.firstChild?.nodeName).toBe('SPAN');
  });
});
