import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  act,
} from '@testing-library/react';

import { useKey } from '../useKey';

import '@testing-library/jest-dom/extend-expect';

describe('useKey', () => {
  const App = (props: any) => {
    const {
      keys = ['s', 'r'],
      event = 'keydown',
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = React.useState(0);

    useKey(keys, () => {
      setValue(value + 1);
    }, { event });

    return (
      <div data-testid="container">
        <p data-testid="value">{value}</p>
        <div className="grid-container">
          <input data-testid="input" ref={inputRef} className="box1" />
        </div>
      </div>
    );
  };

  afterEach(cleanup);

  it('should be defined', () => {
    expect(useKey).toBeDefined();
  });

  it('should trigger the callback when pressed one of the keys', () => {
    const { getByTestId } = render(<App />);
    const valueElement = getByTestId('value');

    act(() => {
      fireEvent.keyDown(window, { key: 's', code: 'keyS', charCode: 83 });
    });
    expect(valueElement).toHaveTextContent('1');

    act(() => {
      fireEvent.keyDown(window, { key: 'r', code: 'keyR', charCode: 82 });
    });
    expect(valueElement).toHaveTextContent('2');
  });

  it('should trigger the callback when pressed on the key', () => {
    const { getByTestId } = render(<App keys="s" />);
    const valueElement = getByTestId('value');

    act(() => {
      fireEvent.keyDown(window, { key: 's', code: 'keyS', charCode: 83 });
    });
    expect(valueElement).toHaveTextContent('1');
  });

  it('should trigger on correct event', () => {
    const { getByTestId } = render(<App keys="s" event="keyup" />);
    const valueElement = getByTestId('value');

    act(() => {
      fireEvent.keyDown(window, { key: 's', code: 'keyS', charCode: 83 });
      fireEvent.keyUp(window, { key: 's', code: 'keyS', charCode: 83 });
    });
    expect(valueElement).toHaveTextContent('1');
  });

  it('should rerender hook', () => {
    const { rerender, getByTestId } = render(<App keys="s" event="keyup" />);
    const valueElement = getByTestId('value');

    act(() => {
      fireEvent.keyDown(window, { key: 's', code: 'keyS', charCode: 83 });
      fireEvent.keyUp(window, { key: 's', code: 'keyS', charCode: 83 });
    });
    expect(valueElement).toHaveTextContent('1');

    rerender(<App keys="r" event="keyup" />);

    act(() => {
      fireEvent.keyDown(window, { key: 's', code: 'keyS', charCode: 83 });
      fireEvent.keyUp(window, { key: 's', code: 'keyS', charCode: 83 });

      fireEvent.keyDown(window, { key: 'r', code: 'keyR', charCode: 82 });
      fireEvent.keyUp(window, { key: 'r', code: 'keyR', charCode: 82 });
    });

    expect(valueElement).toHaveTextContent('2');
  });
});
