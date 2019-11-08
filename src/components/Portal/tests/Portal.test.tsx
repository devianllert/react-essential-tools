import React, { ReactElement } from 'react';

import { cleanup, render } from '@testing-library/react';

import { Portal } from '../Portal';

import '@testing-library/jest-dom/extend-expect';

describe('<Portal />', (): void => {
  afterEach(cleanup);

  it('should render in a different node', () => {
    const { container } = render(
      <div id="test1">
        <h1 className="woofPortal1">Foo</h1>
        <Portal>
          <h1 className="woofPortal2">Foo</h1>
        </Portal>
      </div>,
    );

    expect(container.contains(document.querySelector('.woofPortal1'))).toBeTruthy();
    expect(container.contains(document.querySelector('.woofPortal2'))).toBeFalsy();
  });

  it('should unmount when parent unmounts', () => {
    function Parent(props: { show?: boolean }): ReactElement {
      const { show = true } = props;
      return <div>{show ? <Child /> : null}</div>;
    }

    function Child(): ReactElement {
      const containerRef = React.useRef<HTMLDivElement>(null);
      return (
        <div>
          <div ref={containerRef} />
          <Portal container={(): HTMLDivElement | null => containerRef.current}>
            <div id="test1" />
          </Portal>
        </div>
      );
    }

    const { rerender } = render(<Parent />);

    expect(document.querySelectorAll('#test1')).toHaveLength(1);
    rerender(<Parent show={false} />);
    expect(document.querySelectorAll('#test1')).toHaveLength(0);
  });

  it('should render overlay into container (document)', () => {
    render(
      <Portal>
        <div id="test2" />
      </Portal>,
    );

    expect(document.querySelectorAll('#test2')).toHaveLength(1);
  });

  it('should render overlay into container (DOMNode)', () => {
    const container = document.createElement('div');

    render(
      <Portal container={container}>
        <div id="test2" />
      </Portal>,
    );

    expect(container.querySelectorAll('#test2')).toHaveLength(1);
  });

  it('should change container on prop change', () => {
    const ContainerTest = (props: { containerElement?: boolean; disablePortal?: boolean }): ReactElement => {
      const {
        containerElement,
        disablePortal,
      } = props;

      const containerRef = React.useRef<HTMLElement>(null);
      const container = React.useCallback(
        () => (containerElement ? containerRef.current : null),
        [containerElement],
      );

      return (
        <span>
          <strong ref={containerRef} />
          <Portal disablePortal={disablePortal} container={container}>
            <div id="test3" />
          </Portal>
        </span>
      );
    };

    const { rerender } = render(<ContainerTest disablePortal />);
    expect(document.querySelector('#test3')!.parentNode!.nodeName).toEqual('SPAN');

    rerender(<ContainerTest containerElement disablePortal />);
    expect(document.querySelector('#test3')!.parentNode!.nodeName).toEqual('SPAN');

    rerender(<ContainerTest containerElement />);
    expect(document.querySelector('#test3')!.parentNode!.nodeName).toEqual('STRONG');
  });
});
