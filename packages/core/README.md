# useWebWorker

[![NPM version](https://img.shields.io/npm/v/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)
[![NPM downloads](http://img.shields.io/npm/dm/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)

[English](README.md) | [中文](README_CN.md)

A React hook for easy Web Worker integration with TypeScript support.

### Features

- 🚀 Simple API for Web Worker management
- 💪 Full TypeScript support
- 🔄 Automatic cleanup on unmount
- ⚡ Non-blocking UI operations
- 📦 Zero dependencies

### Installation

```bash
npm install @atom-universe/use-web-worker
# or
pnpm add @atom-universe/use-web-worker
# or
yarn add @atom-universe/use-web-worker
```

### Usage

### File Mode

```tsx
import { useWebWorker } from '@atom-universe/use-web-worker';

function FileExample() {
  const { data, post, isRunning } = useWebWorker<number[]>(
    new URL('./worker.ts', import.meta.url).href
  );

  const handleProcess = () => {
    post([1, 2, 3, 4, 5]);
  };

  return (
    <button onClick={handleProcess} disabled={isRunning}>
      {isRunning ? 'Processing...' : 'Start Process'}
    </button>
  );
}

// worker.ts
self.onmessage = (e) => {
  const data = e.data;
  // Process data
  self.postMessage(data.reverse());
};
```

### Function Mode

```tsx
import { useWebWorkerFn } from '@atom-universe/use-web-worker';

function FunctionExample() {
  const { workerFn, workerStatus, workerTerminate } = useWebWorkerFn(
    (data) => {
      // Your computation logic here
      return data.reverse();
    },
    {
      timeout: 30000, // 30 seconds timeout
      onError: (error) => {
        console.error('Computation error:', error);
      },
    }
  );

  const handleProcess = async () => {
    try {
      const result = await workerFn([1, 2, 3]);
      console.log('Result:', result);
    } catch (error) {
      console.error('Failed to process:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={handleProcess} 
        disabled={workerStatus === 'RUNNING'}
      >
        {workerStatus === 'RUNNING' ? 'Processing...' : 'Start Process'}
      </button>
      
      {workerStatus === 'RUNNING' && (
        <button onClick={() => workerTerminate('PENDING')}>
          Cancel
        </button>
      )}
    </div>
  );
}
```

### API

#### useWebWorker

```typescript
function useWebWorker<Data = any>(
  url: string | (() => Worker) | Worker,
  options?: WorkerOptions
): {
  data: Data | undefined;         // Data returned by worker 
  post: (message: any) => void;   // Send msg to Worker
  terminate: () => void;          // End Worker
  worker: Worker | undefined;     // Worker instance
  isRunning: boolean;             // Is Worker running 
}
```

#### useWebWorkerFn

```typescript
function useWebWorkerFn<T extends (...args: any[]) => any>(
  fn: T,
  options?: {
    timeout?: number;
    onError?: (error: Error) => void;
  }
): {
  workerFn: (...args: Parameters<T>) => Promise<ReturnType<T>>;
  workerStatus: 'IDLE' | 'RUNNING' | 'ERROR' | 'PENDING';
  workerTerminate: (status: 'IDLE' | 'ERROR' | 'PENDING') => void;
}
```

## License

MIT
