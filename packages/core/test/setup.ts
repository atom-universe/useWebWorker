import '@testing-library/jest-dom';
import { afterEach, beforeAll, vi } from 'vitest';

// Mock Worker API
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

// Mock Blob API
global.Blob = vi.fn().mockImplementation((content, options) => ({
  type: options?.type || 'text/javascript',
  size: content?.length || 0,
}));

beforeAll(() => {
  // Mock global APIs
  global.URL = mockURL as unknown as typeof URL;
  global.Worker = vi.fn().mockImplementation(() => mockWorker) as unknown as typeof Worker;

  // Mock window object if not exists
  if (typeof window === 'undefined') {
    global.window = {
      clearTimeout: vi.fn(),
      setTimeout: vi.fn(),
    } as any;
  }
});

// 在每个测试后清理
afterEach(() => {
  vi.clearAllMocks();

  // Reset mock worker state
  mockWorker.onmessage = null;
  mockWorker.onerror = null;
  mockWorker.postMessage.mockClear();
  mockWorker.terminate.mockClear();
  mockURL.createObjectURL.mockClear();
  mockURL.revokeObjectURL.mockClear();
});

// Export mock objects for tests to use
export { mockWorker, mockURL };
