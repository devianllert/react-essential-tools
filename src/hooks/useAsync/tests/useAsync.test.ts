import { renderHook, RenderHookResult } from '@testing-library/react-hooks';
import { useCallback } from 'react';

import { useAsync, AsyncFn } from '../useAsync';

type Fn<T> = (...args: any[]) => Promise<T>;

const setUp = <T>(callback: Fn<T>): RenderHookResult<{ fn: Fn<T> }, AsyncFn<T>> => {
  const initialProps = { fn: callback };

  return renderHook(({ fn }): AsyncFn<T> => useAsync(fn), { initialProps });
};

describe('useAsync', () => {
  it('should be defined', () => {
    expect(useAsync).toBeDefined();
  });

  describe('a success', () => {
    let resolver: () => Promise<string>;

    beforeEach(() => {
      resolver = jest.fn(async (): Promise<string> => new Promise((resolve): void => {
        const wait = setTimeout(() => {
          clearTimeout(wait);
          resolve('yay');
        }, 0);
      }));
    });

    it('initially starts loading', () => {
      const hook = setUp(resolver);

      const [state] = hook.result.current;

      expect(state.pending).toEqual(true);
    });

    it('resolves', async () => {
      expect.assertions(4);

      const hook = setUp(resolver);

      hook.rerender({ fn: resolver });
      await hook.waitForNextUpdate();

      const [state] = hook.result.current;

      expect(resolver).toHaveBeenCalledTimes(1);

      expect(state.pending).toBeFalsy();
      expect(state.result).toEqual('yay');
      expect(state.error).toBeUndefined();
    });
  });

  describe('an error', () => {
    let rejection: () => Promise<string>;

    beforeEach(() => {
      rejection = jest.fn(async (): Promise<string> => new Promise((_, reject): void => {
        const wait = setTimeout(() => {
          clearTimeout(wait);
          reject(Error('error'));
        }, 0);
      }));
    });

    it('initially starts loading', () => {
      const hook = setUp(rejection);

      const [state] = hook.result.current;

      expect(state.pending).toBeTruthy();
    });

    it('resolves', async () => {
      expect.assertions(4);

      const hook = setUp(rejection);

      hook.rerender({ fn: rejection });
      await hook.waitForNextUpdate();

      const [state] = hook.result.current;

      expect(rejection).toHaveBeenCalledTimes(1);
      expect(state.pending).toBeFalsy();
      expect(state.error).toEqual(Error('error'));
      expect(state.result).toBeUndefined();
    });
  });

  describe('the fn is a dependency', () => {
    const initialFn = async (): Promise<string> => 'value';

    it('renders the first value', async () => {
      const hook = setUp(initialFn);

      await hook.waitForNextUpdate();

      const [state] = hook.result.current;

      expect(state.result).toEqual('value');
    });
  });

  describe('the additional dependencies list changes', () => {
    let callCount = 0;
    let hook: RenderHookResult<{ fn: Fn<string>; counter: number }, AsyncFn<string>>;

    const staticFunction = async (counter: number): Promise<string> => {
      callCount += 1;
      return `counter is ${counter} and callCount is ${callCount}`;
    };

    beforeEach((done) => {
      callCount = 0;
      hook = renderHook(
        ({ fn, counter }) => {
          const callback = useCallback(() => fn(counter), [fn, counter]);
          return useAsync<string>(callback, [callback]);
        },
        {
          initialProps: {
            counter: 0,
            fn: staticFunction,
          },
        },
      );

      hook.waitForNextUpdate().then(done);
    });

    it('initial renders the first passed pargs', () => {
      const [state] = hook.result.current;

      expect(state.result).toEqual('counter is 0 and callCount is 1');
    });

    it('renders a different value when deps change', async () => {
      expect.assertions(1);

      hook.rerender({ fn: staticFunction, counter: 1 });
      await hook.waitForNextUpdate();

      const [state] = hook.result.current;

      expect(state.result).toEqual('counter is 1 and callCount is 2');
    });
  });
});
