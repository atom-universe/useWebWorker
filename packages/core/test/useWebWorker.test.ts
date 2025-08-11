import { renderHook, act } from '@testing-library/react';
import useWebWorker from '../src/useWebWorker.js';
import { vi } from 'vitest';
import { mockWorker, mockURL } from './setup.js';

describe('useWebWorker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock worker state
    mockWorker.onmessage = null;
    mockWorker.onerror = null;
  });

  it('should initialize with default values', async () => {
    const { result } = renderHook(() => useWebWorker('worker.js'));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // 验证初始状态
    expect(result.current[0]).toBeUndefined(); // data
    expect(result.current[1]).toBeInstanceOf(Function); // post
    expect(result.current[2]).toBeInstanceOf(Function); // terminate
    expect(result.current[3]).toBeDefined(); // worker
    expect(result.current[4]).toBe(false); // isRunning
  });

  it('should handle successful message', async () => {
    const { result } = renderHook(() => useWebWorker('worker.js'));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // 发送消息
    act(() => {
      result.current[1]('test message');
    });

    // 验证状态
    expect(result.current[4]).toBe(true); // isRunning

    // 模拟成功响应
    act(() => {
      if (mockWorker.onmessage) {
        mockWorker.onmessage({
          data: 'success response',
        } as MessageEvent);
      }
    });

    // 验证结果
    expect(result.current[0]).toBe('success response');
    expect(result.current[4]).toBe(false); // isRunning
  });

  it('should handle error', async () => {
    const { result } = renderHook(() => useWebWorker('worker.js'));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // 发送消息
    act(() => {
      result.current[1]('test message');
    });

    // 模拟错误
    act(() => {
      if (mockWorker.onerror) {
        mockWorker.onerror({
          message: 'Worker error',
          preventDefault: vi.fn(),
        } as unknown as ErrorEvent);
      }
    });

    // 验证状态
    expect(result.current[4]).toBe(false); // isRunning
  });

  it('should terminate worker', async () => {
    const { result } = renderHook(() => useWebWorker('worker.js'));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // 终止 worker
    act(() => {
      result.current[2]();
    });

    expect(mockWorker.terminate).toHaveBeenCalled();
    expect(result.current[3]).toBeUndefined(); // worker should be undefined
  });

  it('should handle function worker creation', async () => {
    const workerFn = () => mockWorker as any;
    const { result } = renderHook(() => useWebWorker(workerFn));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // 验证 worker 实例
    expect(result.current[3]).toBe(mockWorker);
  });

  it('should handle direct worker instance', async () => {
    const { result } = renderHook(() => useWebWorker(mockWorker as any));

    // Wait for hook to initialize
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // 验证 worker 实例
    expect(result.current[3]).toBe(mockWorker);
  });
});
