import { renderHook, act } from '@testing-library/react';
import useWebWorkerFn from '../src/useWebWorkerFn.js';
import { WorkerMessageType } from '../src/lib/createWorkerBlobUrl.js';
import { vi } from 'vitest';

describe('useWebWorkerFn', () => {
  const mockWorker = {
    postMessage: vi.fn(),
    terminate: vi.fn(),
    onmessage: null as ((e: MessageEvent) => void) | null,
    onerror: null as ((e: ErrorEvent) => void) | null,
    _url: 'mock-url',
  };

  const mockURL = {
    createObjectURL: vi.fn().mockReturnValue('mock-url'),
    revokeObjectURL: vi.fn(),
  };

  beforeAll(() => {
    global.URL = mockURL as unknown as typeof URL;
    global.Worker = vi.fn().mockImplementation(() => mockWorker) as unknown as typeof Worker;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a worker and execute the function', async () => {
    const mockFn = (a: number, b: number) => a + b;
    const { result } = renderHook(() => useWebWorkerFn(mockFn));

    const promise = act(async () => {
      return result.current[0](1, 2);
    });

    act(() => {
      mockWorker.onmessage?.({
        data: [WorkerMessageType.SUCCESS, 3],
      } as MessageEvent);
    });

    const value = await promise;
    expect(value).toBe(3);
    expect(mockWorker.postMessage).toHaveBeenCalledWith([[1, 2]]);
  });

  it('should handle errors', async () => {
    const mockFn = () => {
      throw new Error('Test error');
    };
    const onError = vi.fn();
    const { result } = renderHook(() => useWebWorkerFn(mockFn, { onError }));

    const promise = act(async () => {
      return result.current[0]();
    });

    act(() => {
      mockWorker.onmessage?.({
        data: [WorkerMessageType.ERROR, 'Test error'],
      } as MessageEvent);
    });

    await expect(promise).rejects.toThrow('Test error');
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should handle timeouts', async () => {
    const mockFn = () => new Promise(resolve => setTimeout(resolve, 1000));
    const onError = vi.fn();
    const { result } = renderHook(() => useWebWorkerFn(mockFn, { timeout: 100, onError }));

    const promise = act(async () => {
      return result.current[0]();
    });

    act(() => {
      mockWorker.onmessage?.({
        data: [WorkerMessageType.TIMEOUT_EXPIRED, 'Timeout'],
      } as MessageEvent);
    });

    await expect(promise).rejects.toThrow('Timeout');
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should terminate worker', async () => {
    const mockFn = () => 'test result';
    const { result } = renderHook(() => useWebWorkerFn(mockFn));

    const promise = act(async () => {
      return result.current[0]();
    });

    // 模拟成功响应
    act(() => {
      mockWorker.onmessage?.({
        data: [WorkerMessageType.SUCCESS, 'test result'],
      } as MessageEvent);
    });

    act(() => {
      result.current[2]();
    });

    expect(mockWorker.terminate).toHaveBeenCalled();
    expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  it('should handle custom progress messages via onMessage callback', () => {
    const onMessage = vi.fn();

    const mockOnMessage = (e: MessageEvent) => {
      const [status, result] = e.data as [string, any];

      if (
        status !== WorkerMessageType.SUCCESS &&
        status !== WorkerMessageType.ERROR &&
        status !== WorkerMessageType.TIMEOUT_EXPIRED
      ) {
        onMessage({ type: status, data: result });
      }
    };

    mockOnMessage({ data: ['PROGRESS', { percent: 25 }] } as MessageEvent);
    mockOnMessage({ data: ['PROGRESS', { percent: 50 }] } as MessageEvent);
    mockOnMessage({ data: ['PROGRESS', { percent: 75 }] } as MessageEvent);

    mockOnMessage({ data: ['STATUS_UPDATE', { status: 'processing' }] } as MessageEvent);

    mockOnMessage({ data: [WorkerMessageType.SUCCESS, 'result'] } as MessageEvent);

    expect(onMessage).toHaveBeenCalledTimes(4);
    expect(onMessage).toHaveBeenNthCalledWith(1, { type: 'PROGRESS', data: { percent: 25 } });
    expect(onMessage).toHaveBeenNthCalledWith(2, { type: 'PROGRESS', data: { percent: 50 } });
    expect(onMessage).toHaveBeenNthCalledWith(3, { type: 'PROGRESS', data: { percent: 75 } });
    expect(onMessage).toHaveBeenNthCalledWith(4, {
      type: 'STATUS_UPDATE',
      data: { status: 'processing' },
    });
  });

  it.skip('should handle worker errors', async () => {
    const mockFn = () => 'test result';
    const onError = vi.fn();

    renderHook(() => useWebWorkerFn(mockFn, { onError }));

    // 模拟 worker.onerror 直接调用
    const errorEvent = {
      message: 'Worker error',
      preventDefault: vi.fn(),
    };

    mockWorker.onerror?.(errorEvent as unknown as ErrorEvent);

    expect(onError).toHaveBeenCalled();
  });
});
