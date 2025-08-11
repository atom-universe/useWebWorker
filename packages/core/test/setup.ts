import '@testing-library/jest-dom';
import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { vi } from 'vitest';

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

beforeAll(() => {
  // Mock global APIs
  global.URL = mockURL as unknown as typeof URL;
  global.Worker = vi.fn().mockImplementation(() => mockWorker) as unknown as typeof Worker;

  // Mock window object if not exists
  if (typeof window === 'undefined') {
    global.window = {} as any;
  }
});

// 在每个测试后清理 DOM
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Export mock objects for tests to use
export { mockWorker, mockURL };
