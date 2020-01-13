import React, { ReactElement } from 'react';

import { cleanup, render } from '@testing-library/react';

import { Portal } from '../Portal';

import '@testing-library/jest-dom/extend-expect';

describe('<Portal />', (): void => {
  afterEach(cleanup);

  describe('ref', () => {
    it('should have access to the mountNode when disabledPortal={false}', () => {
      const refSpy = jest.fn();
      const { unmount } = render(
        <Portal ref={refSpy}>
          <h1>Foo</h1>
        </Portal>,
      );

      expect(refSpy).toBeCalledWith(document.body);
      unmount();
      expect(refSpy).toBeCalledWith(null);
    });

    it('should have access to the mountNode when disabledPortal={true}', () => {
      const refSpy = jest.fn();
      const { unmount } = render(
        <Portal disablePortal ref={refSpy}>
          <h1 className="woofPortal">Foo</h1>
        </Portal>,
      );

      const mountNode = document.querySelector('.woofPortal');

      expect(refSpy).toBeCalledWith(mountNode);
      unmount();
      expect(refSpy).toBeCalledWith(null);
    });

    it('should have access to the mountNode when switching disabledPortal', () => {
      const refSpy = jest.fn();
      const { rerender, unmount } = render(
        <Portal disablePortal ref={refSpy}>
          <h1 className="woofPortal">Foo</h1>
        </Portal>,
      );

      const mountNode = document.querySelector('.woofPortal');

      expect(refSpy).toBeCalledWith(mountNode);

      rerender(
        <Portal ref={refSpy}>
          <h1 className="woofPortal">Foo</h1>
        </Portal>,
      );

      expect(refSpy).toBeCalledWith(document.body);
      unmount();
      expect(refSpy).toBeCalledWith(null);
    });
  });

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

  it('should call ref after child effect', () => {
    const callOrder: string[] = [];
    const handleRef = (node: any): void => {
      if (node) {
        callOrder.push('ref');
      }
    };

    const updateFunction = (): void => {
      callOrder.push('effect');
    };

    function Test(props: any): any {
      const { container } = props;

      React.useEffect(() => {
        updateFunction();
      }, [container]);

      return (
        <Portal ref={handleRef} container={container}>
          <div />
        </Portal>
      );
    }

    const { rerender } = render(<Test container={document.createElement('div')} />);

    rerender(<Test container={null} />);
    rerender(<Test container={document.createElement('div')} />);
    rerender(<Test container={null} />);

    expect(callOrder).toStrictEqual([
      'effect',
      'ref',
      'effect',
      'ref',
      'effect',
      'ref',
      'effect',
      'ref',
    ]);
  });
});
