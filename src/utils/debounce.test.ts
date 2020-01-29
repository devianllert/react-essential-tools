import { debounce } from './debounce';

describe('debounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should debounce', () => {
    const handler = jest.fn();
    const expectedContext = { foo: 'bar' };

    let actualContext;

    function collectContext(this: any, ...args: any[]): void {
      actualContext = this;
      handler(...args);
    }
    const debounced = debounce(collectContext);

    debounced.apply(expectedContext, ['a', 'b']);

    expect(handler).not.toHaveBeenCalled();
    jest.advanceTimersByTime(166);
    expect(handler).toHaveBeenCalledTimes(1);

    expect(handler.mock.calls[0][0]).toEqual(['a', 'b']);
    expect(actualContext).toEqual(expectedContext);
  });

  it('should clear a pending task', () => {
    const handler = jest.fn();
    const debounced = debounce(handler);

    debounced();
    expect(handler).not.toHaveBeenCalled();

    debounced.clear();

    jest.advanceTimersByTime(166);
    expect(handler).not.toHaveBeenCalled();
  });
});
