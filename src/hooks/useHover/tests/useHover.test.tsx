import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { cleanup, render, fireEvent } from '@testing-library/react';

import { useHover } from '../useHover';

import '@testing-library/jest-dom/extend-expect';

const setUp = () => renderHook(() => useHover());

describe('useHover', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();

    cleanup();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(useHover).toBeDefined();
  });

  it('should return correct structure', () => {
    const hook = setUp();

    expect(typeof hook.result.current[0] === 'boolean').toBeTruthy();
    expect(typeof hook.result.current[1].onMouseEnter === 'function').toBeTruthy();
    expect(typeof hook.result.current[1].onMouseLeave === 'function').toBeTruthy();
  });

  it('should change state when hover', () => {
    const Component = () => {
      const [hovered, { onMouseEnter, onMouseLeave }] = useHover();

      return (
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          data-testid="test"
        >
          {hovered ? 'hovered' : 'hover'}
        </div>
      );
    };

    const { getByTestId } = render(<Component />);

    expect(getByTestId('test')).toHaveTextContent('hover');

    fireEvent.mouseEnter(getByTestId('test'));
    expect(getByTestId('test')).toHaveTextContent('hovered');

    fireEvent.mouseLeave(getByTestId('test'));
    expect(getByTestId('test')).toHaveTextContent('hover');
  });
});
