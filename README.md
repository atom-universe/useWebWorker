# useWebWorker

[![NPM version](https://img.shields.io/npm/v/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)
[![NPM downloads](http://img.shields.io/npm/dm/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)

[English](README.md) | [中文](README_CN.md)

A React hook for easy Web Worker integration with TypeScript support.

### Features

- 🚀 Simple API for Web Worker management
- 💪 Full TypeScript support with automatic type inference
- 🔄 Automatic cleanup on unmount
- ⚡ Non-blocking UI operations
- 📦 Zero dependencies
- ⏱️ Built-in timeout handling
- 🎯 Function-based worker creation
- 🔍 Comprehensive error handling
- 📝 No additional files needed - write your worker logic inline

### Installation

```bash
npm install @atom-universe/use-web-worker
# or
pnpm add @atom-universe/use-web-worker
# or
yarn add @atom-universe/use-web-worker
```

### Usage

```tsx
import useWebWorker from '@atom-universe/use-web-worker';

function Example() {
  const [workerFn, workerStatus, workerTerminate] = useWebWorker(
    data => {
      // Your computation logic here
      return data.reverse();
    },
    {
      timeout: 30000, // 30 seconds timeout
      onError: error => {
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
      <button onClick={handleProcess} disabled={workerStatus === 'RUNNING'}>
        {workerStatus === 'RUNNING' ? 'Processing...' : 'Start Process'}
      </button>

      {workerStatus === 'RUNNING' && (
        <button onClick={() => workerTerminate('PENDING')}>Cancel</button>
      )}
    </div>
  );
}
```

### API

```typescript
function useWebWorker<T extends (...args: any[]) => any>(
  fn: T,
  options?: {
    timeout?: number; // Timeout in milliseconds
    dependencies?: string[]; // External dependencies
    localDependencies?: Function[]; // Local function dependencies
    onError?: (error: Error) => void; // Error callback
  }
): [
  (...args: Parameters<T>) => Promise<ReturnType<T>>, // Worker function
  'PENDING' | 'RUNNING' | 'SUCCESS' | 'ERROR' | 'TIMEOUT_EXPIRED', // Status
  (status?: WebWorkerStatus) => void, // Terminate function
];
```

## License

MIT
