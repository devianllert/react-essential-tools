import { fireEvent, render } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { useClickAway } from '../useClickAway';

describe('useClickAway', () => {
  it('useClickAway should react on click outside and call callback', () => {
    const mockFn = jest.fn();

    const TestComponent = (): ReactElement => {
      const ref1 = React.useRef(null);
      useClickAway(ref1, mockFn);

      return (
        <div ref={ref1} data-testid="1">foo</div>
      );
    };

    const { container, getByTestId } = render(<TestComponent />);

    const firstEl = getByTestId('1');

    fireEvent.mouseDown(firstEl);
    fireEvent.mouseUp(firstEl);
    expect(mockFn).toBeCalledTimes(0);

    fireEvent.mouseDown(container);
    fireEvent.mouseUp(container);

    expect(mockFn).toBeCalledTimes(1);
  });
});
