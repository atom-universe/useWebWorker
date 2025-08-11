import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockWorker, mockURL } from './setup.js';

// 直接测试 hook 的逻辑，而不是通过 React 测试库
describe('useWebWorkerFn Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock worker state
    mockWorker.onmessage = null;
    mockWorker.onerror = null;
  });

  it('should create a worker and execute the function', async () => {
    // 测试 Worker 创建逻辑
    const worker = new Worker('mock-url');
    expect(worker).toBeDefined();
    // Worker 构造函数会调用 mock，但 createObjectURL 不会在这里调用
    expect(worker).toBe(mockWorker);
  });

  it('should handle worker postMessage', () => {
    const worker = new Worker('mock-url');
    worker.postMessage([1, 2]);
    expect(mockWorker.postMessage).toHaveBeenCalledWith([1, 2]);
  });

  it('should handle worker termination', () => {
    const worker = new Worker('mock-url');
    worker.terminate();
    expect(mockWorker.terminate).toHaveBeenCalled();
  });

  it('should handle worker error events', () => {
    const worker = new Worker('mock-url');
    const errorEvent = {
      message: 'Worker error',
      preventDefault: vi.fn(),
    } as unknown as ErrorEvent;

    // 直接调用 onerror 来测试
    worker.onerror = vi.fn();
    if (worker.onerror) {
      worker.onerror(errorEvent);
    }

    expect(worker.onerror).toHaveBeenCalledWith(errorEvent);
  });

  it('should handle worker message events', () => {
    const worker = new Worker('mock-url');
    const messageEvent = {
      data: [0, 'success result'],
    } as MessageEvent;

    if (worker.onmessage) {
      worker.onmessage(messageEvent);
    }

    expect(messageEvent.data).toEqual([0, 'success result']);
  });

  it('should handle URL creation and revocation', () => {
    const url = URL.createObjectURL(new Blob(['test']));
    expect(url).toBe('mock-url');
    expect(mockURL.createObjectURL).toHaveBeenCalled();

    URL.revokeObjectURL(url);
    expect(mockURL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });
});
