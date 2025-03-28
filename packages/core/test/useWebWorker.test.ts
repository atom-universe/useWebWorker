import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import useWebWorker from '../src/useWebWorker';

/**
 * useWebWorker
 * 测试：
 * 1. 初始化状态
 * 2. 消息发送和接收
 * 3. 错误处理
 * 4. Worker 终止
 * 5. 不同 Worker 创建方式
 */
describe('useWebWorker', () => {
  const mockWorker = {
    postMessage: vi.fn(),
    terminate: vi.fn(),
    onmessage: null as ((e: MessageEvent) => void) | null,
    onerror: null as ((e: ErrorEvent) => void) | null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.Worker = vi.fn(() => mockWorker as any);
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWebWorker('worker.js'));

    // 验证初始状态
    expect(result.current[0]).toBeUndefined();
    expect(result.current[1]).toBeDefined();
    expect(result.current[2]).toBeDefined();
    expect(result.current[3]).toBeDefined();
    expect(result.current[4]).toBe(false);
  });

  it('should handle successful message', async () => {
    const { result } = renderHook(() => useWebWorker('worker.js'));

    // 发送消息
    act(() => {
      result.current[1]({ type: 'test' });
    });

    // 验证运行状态
    expect(result.current[4]).toBe(true);

    // 模拟接收消息
    act(() => {
      mockWorker.onmessage?.({ data: 'success' } as MessageEvent);
    });

    // 验证结果
    expect(result.current[0]).toBe('success');
    expect(result.current[4]).toBe(false);
  });

  it('should handle error', async () => {
    const { result } = renderHook(() => useWebWorker('worker.js'));

    // 发送消息
    act(() => {
      result.current[1]({ type: 'test' });
    });

    // 验证运行状态
    expect(result.current[4]).toBe(true);

    // 模拟错误
    act(() => {
      mockWorker.onerror?.(new ErrorEvent('error'));
    });

    // 验证错误状态
    expect(result.current[4]).toBe(false);
  });

  it('should terminate worker', () => {
    const { result } = renderHook(() => useWebWorker('worker.js'));

    // 终止 worker
    act(() => {
      result.current[2]();
    });

    // 验证终止结果
    expect(mockWorker.terminate).toHaveBeenCalled();
  });

  it('should handle function worker creation', () => {
    const workerFn = () => mockWorker as any;
    const { result } = renderHook(() => useWebWorker(workerFn));

    // 验证 worker 实例
    expect(result.current[3]).toBeDefined();
  });

  it('should handle direct worker instance', () => {
    const { result } = renderHook(() => useWebWorker(mockWorker as any));

    // 验证 worker 实例
    expect(result.current[3]).toBeDefined();
  });
});
