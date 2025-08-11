import { renderHook, act } from '@testing-library/react';
import useWebWorkerFn from '../src/useWebWorkerFn.js';
import { WorkerMessageType } from '../src/lib/createWorkerBlobUrl.js';
import { vi } from 'vitest';
import { mockWorker, mockURL } from './setup.js';

describe('useWebWorkerFn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock worker state
    mockWorker.onmessage = null;
    mockWorker.onerror = null;
  });

  it('should create a worker and execute the function', async () => {
    const mockFn = (a: number, b: number) => a + b;
    const { result } = renderHook(() => useWebWorkerFn(mockFn));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const promise = act(async () => {
      return result.current[0](1, 2);
    });

    // Simulate worker response
    act(() => {
      if (mockWorker.onmessage) {
        mockWorker.onmessage({
          data: [WorkerMessageType.SUCCESS, 3],
        } as MessageEvent);
      }
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

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const promise = act(async () => {
      return result.current[0]();
    });

    // Simulate worker error response
    act(() => {
      if (mockWorker.onmessage) {
        mockWorker.onmessage({
          data: [WorkerMessageType.ERROR, 'Test error'],
        } as MessageEvent);
      }
    });

    await expect(promise).rejects.toThrow('Test error');
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should handle timeouts', async () => {
    const mockFn = () => new Promise(resolve => setTimeout(resolve, 1000));
    const onError = vi.fn();
    const { result } = renderHook(() => useWebWorkerFn(mockFn, { timeout: 100, onError }));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const promise = act(async () => {
      return result.current[0]();
    });

    // Simulate timeout response
    act(() => {
      if (mockWorker.onmessage) {
        mockWorker.onmessage({
          data: [WorkerMessageType.TIMEOUT_EXPIRED, 'Timeout'],
        } as MessageEvent);
      }
    });

    await expect(promise).rejects.toThrow('Timeout');
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should terminate worker', async () => {
    const mockFn = () => 'test result';
    const { result } = renderHook(() => useWebWorkerFn(mockFn));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Test termination
    act(() => {
      result.current[2]();
    });

    expect(mockWorker.terminate).toHaveBeenCalled();
    expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  it('should handle custom progress messages via onMessage callback', async () => {
    const mockFn = () => 'test result';
    const onMessage = vi.fn();
    const { result } = renderHook(() => useWebWorkerFn(mockFn, { onMessage }));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const promise = act(async () => {
      return result.current[0]();
    });

    // Simulate custom message
    act(() => {
      if (mockWorker.onmessage) {
        mockWorker.onmessage({
          data: [999, 'Custom message'],
        } as MessageEvent);
      }
    });

    // Simulate success response
    act(() => {
      if (mockWorker.onmessage) {
        mockWorker.onmessage({
          data: [WorkerMessageType.SUCCESS, 'test result'],
        } as MessageEvent);
      }
    });

    await promise;
    expect(onMessage).toHaveBeenCalledWith({
      type: 999,
      data: 'Custom message',
    });
  });

  it('should handle worker errors', async () => {
    const mockFn = () => 'test result';
    const onError = vi.fn();
    const { result } = renderHook(() => useWebWorkerFn(mockFn, { onError }));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const promise = act(async () => {
      return result.current[0]();
    });

    // Simulate worker error
    act(() => {
      if (mockWorker.onerror) {
        mockWorker.onerror({
          message: 'Worker error',
          preventDefault: vi.fn(),
        } as unknown as ErrorEvent);
      }
    });

    await expect(promise).rejects.toThrow('Worker error');
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should reject when worker is already running', async () => {
    const mockFn = () => 'test result';
    const { result } = renderHook(() => useWebWorkerFn(mockFn));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Start first worker
    const promise1 = act(async () => {
      return result.current[0]();
    });

    // Try to start second worker while first is running
    const promise2 = act(async () => {
      return result.current[0]();
    });

    // First should succeed, second should fail
    await expect(promise2).rejects.toThrow('Worker is already running');

    // Complete first worker
    act(() => {
      if (mockWorker.onmessage) {
        mockWorker.onmessage({
          data: [WorkerMessageType.SUCCESS, 'test result'],
        } as MessageEvent);
      }
    });

    await promise1;
  });
});
