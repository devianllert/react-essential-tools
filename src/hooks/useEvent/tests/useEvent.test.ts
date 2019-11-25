import { renderHook } from '@testing-library/react-hooks';
import { useEvent } from '../useEvent';

interface Props {
  name: string;
  handler: (...args: any[]) => void;
  target: any | null;
  options?: AddEventListenerOptions;
}

const propsList1: Props[] = [
  {
    name: 'name1',
    handler: (): void => {},
    target: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    options: {
      passive: true,
    },
  },
  {
    name: 'name2',
    handler: (): void => {},
    target: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    options: {
      passive: false,
    },
  },
];

describe('useEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call addEventListener/removeEventListener on mount/unmount', () => {
    const { unmount } = renderHook((p: Props) => useEvent(p.name, p.handler, p.target, p.options), {
      initialProps: propsList1[0],
    });
    expect(propsList1[0].target.addEventListener).toHaveBeenCalledTimes(1);
    expect(propsList1[0].target.addEventListener).toHaveBeenLastCalledWith(
      propsList1[0].name,
      propsList1[0].handler,
      propsList1[0].options,
    );

    unmount();

    expect(propsList1[0].target.removeEventListener).toHaveBeenCalledTimes(1);
    expect(propsList1[0].target.removeEventListener).toHaveBeenLastCalledWith(
      propsList1[0].name,
      propsList1[0].handler,
      propsList1[0].options,
    );
  });

  it('should not call removeEventListener if deps are same as previous', () => {
    const { rerender } = renderHook((p: Props) => useEvent(p.name, p.handler, p.target, p.options), {
      initialProps: propsList1[0],
    });

    expect(propsList1[0].target.addEventListener).toHaveBeenCalledTimes(1);
    expect(propsList1[0].target.addEventListener).toHaveBeenLastCalledWith(
      propsList1[0].name,
      propsList1[0].handler,
      propsList1[0].options,
    );

    rerender({
      name: propsList1[0].name,
      handler: propsList1[0].handler,
      target: propsList1[0].target,
      options: propsList1[0].options,
    });
    expect(propsList1[0].target.removeEventListener).not.toHaveBeenCalled();
  });

  it('should call addEventListener/removeEventListener if name changes', () => {
    const { rerender } = renderHook((p: Props) => useEvent(p.name, p.handler, p.target, p.options), {
      initialProps: propsList1[0],
    });

    expect(propsList1[0].target.addEventListener).toHaveBeenCalledTimes(1);
    expect(propsList1[0].target.addEventListener).toHaveBeenLastCalledWith(
      propsList1[0].name,
      propsList1[0].handler,
      propsList1[0].options,
    );

    rerender({
      name: propsList1[1].name,
      handler: propsList1[0].handler,
      target: propsList1[0].target,
      options: propsList1[0].options,
    });

    expect(propsList1[0].target.removeEventListener).toHaveBeenCalledTimes(1);

    expect(propsList1[0].target.addEventListener).toHaveBeenCalledTimes(2);
    expect(propsList1[0].target.addEventListener).toHaveBeenLastCalledWith(
      propsList1[1].name,
      propsList1[0].handler,
      propsList1[0].options,
    );
  });

  it('should call addEventListener/removeEventListener if handler changes', () => {
    const { rerender } = renderHook((p: Props) => useEvent(p.name, p.handler, p.target, p.options), {
      initialProps: propsList1[0],
    });

    expect(propsList1[0].target.addEventListener).toHaveBeenCalledTimes(1);
    expect(propsList1[0].target.addEventListener).toHaveBeenLastCalledWith(
      propsList1[0].name,
      propsList1[0].handler,
      propsList1[0].options,
    );

    rerender({
      name: propsList1[1].name,
      handler: propsList1[1].handler,
      target: propsList1[0].target,
      options: propsList1[0].options,
    });

    expect(propsList1[0].target.removeEventListener).toHaveBeenCalledTimes(1);

    expect(propsList1[0].target.addEventListener).toHaveBeenCalledTimes(2);
    expect(propsList1[0].target.addEventListener).toHaveBeenLastCalledWith(
      propsList1[1].name,
      propsList1[1].handler,
      propsList1[0].options,
    );
  });

  it('should call addEventListener/removeEventListener if options changes', () => {
    const { rerender } = renderHook((p: Props) => useEvent(p.name, p.handler, p.target, p.options), {
      initialProps: propsList1[0],
    });

    expect(propsList1[0].target.addEventListener).toHaveBeenCalledTimes(1);
    expect(propsList1[0].target.addEventListener).toHaveBeenLastCalledWith(
      propsList1[0].name,
      propsList1[0].handler,
      propsList1[0].options,
    );

    rerender({
      name: propsList1[1].name,
      handler: propsList1[1].handler,
      target: propsList1[0].target,
      options: propsList1[1].options,
    });

    expect(propsList1[0].target.removeEventListener).toHaveBeenCalledTimes(1);

    expect(propsList1[0].target.addEventListener).toHaveBeenCalledTimes(2);
    expect(propsList1[0].target.addEventListener).toHaveBeenLastCalledWith(
      propsList1[1].name,
      propsList1[1].handler,
      propsList1[1].options,
    );
  });

  it('should call addEventListener/removeEventListener if target changes', () => {
    const { rerender } = renderHook((p: Props) => useEvent(p.name, p.handler, p.target, p.options), {
      initialProps: propsList1[0],
    });

    expect(propsList1[0].target.addEventListener).toHaveBeenCalledTimes(1);
    expect(propsList1[0].target.addEventListener).toHaveBeenLastCalledWith(
      propsList1[0].name,
      propsList1[0].handler,
      propsList1[0].options,
    );

    rerender({
      name: propsList1[1].name,
      handler: propsList1[1].handler,
      target: propsList1[1].target,
      options: propsList1[1].options,
    });

    expect(propsList1[0].target.removeEventListener).toHaveBeenCalledTimes(1);

    expect(propsList1[1].target.addEventListener).toHaveBeenCalledTimes(1);
    expect(propsList1[1].target.addEventListener).toHaveBeenLastCalledWith(
      propsList1[1].name,
      propsList1[1].handler,
      propsList1[1].options,
    );
  });
});
