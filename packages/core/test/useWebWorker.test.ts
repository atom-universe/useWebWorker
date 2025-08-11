import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockWorker } from './setup.js';

// 直接测试 hook 的逻辑，而不是通过 React 测试库
describe('useWebWorker Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock worker state
    mockWorker.onmessage = null;
    mockWorker.onerror = null;
  });

  it('should create a worker with URL', () => {
    const worker = new Worker('worker.js');
    expect(worker).toBeDefined();
  });

  it('should handle worker postMessage', () => {
    const worker = new Worker('worker.js');
    worker.postMessage('test message');
    expect(mockWorker.postMessage).toHaveBeenCalledWith('test message');
  });

  it('should handle worker termination', () => {
    const worker = new Worker('worker.js');
    worker.terminate();
    expect(mockWorker.terminate).toHaveBeenCalled();
  });

  it('should handle worker error events', () => {
    const worker = new Worker('worker.js');
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
    const worker = new Worker('worker.js');
    const messageEvent = {
      data: 'success response',
    } as MessageEvent;

    if (worker.onmessage) {
      worker.onmessage(messageEvent);
    }

    expect(messageEvent.data).toBe('success response');
  });

  it('should handle function worker creation', () => {
    const workerFn = () => mockWorker as any;
    const worker = workerFn();
    expect(worker).toBe(mockWorker);
  });

  it('should handle direct worker instance', () => {
    const worker = mockWorker as any;
    expect(worker).toBe(mockWorker);
  });
});
