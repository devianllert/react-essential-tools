import { act, renderHook } from '@testing-library/react-hooks';

import { useLocalStorage } from '../useLocalStorage';

const setUp = (key: string, initialValue?: any) => renderHook(() => useLocalStorage(key, initialValue));

class LocalStorageMock {
  public store: {
    [key: string]: string;
  }

  constructor() {
    this.store = {};
  }

  public clear(): void {
    this.store = {};
  }

  public getItem(key: string): any | undefined {
    return this.store[key] || undefined;
  }

  public setItem(key: string, value: any): void {
    this.store[key] = value.toString();
  }

  public removeItem(key: string): void {
    delete this.store[key];
  }
}

(global as any).localStorage = new LocalStorageMock();

describe('useLocalStorage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should return undefined if initial value is undefined and local storage is empty', () => {
    const hook = setUp('key');

    const [value, setValue] = hook.result.current;

    expect(value).toEqual(undefined);
    expect(typeof setValue).toBe('function');
  });

  it('should return initial value if local storage is empty', () => {
    const hook = setUp('key', '1');

    const [value] = hook.result.current;

    expect(value).toEqual('1');
  });

  it('should return value in local storage', () => {
    localStorage.setItem('key', JSON.stringify('1'));

    const hook = setUp('key');

    const [value] = hook.result.current;

    expect(value).toEqual('1');
  });

  it('should change value', () => {
    const { result } = setUp('key');
    const [, setValue] = result.current;

    expect(result.current[0]).toEqual(undefined);

    act((): void => {
      setValue('150');
    });

    expect(result.current[0]).toEqual('150');
  });
});
