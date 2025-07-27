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
- 🔍 Comprehensive error handling
- 📊 Progress reporting and custom message passing
- 🎯 Function-based worker creation - No additional files needed - write your worker logic inline

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
import { useState } from 'react';

function Example() {
  const [progress, setProgress] = useState(0);

  const [workerFn, workerStatus, workerTerminate] = useWebWorker(
    (data, workerContext) => {
      const total = data.length;
      const result = [];

      for (let i = 0; i < total; i++) {
        result.push(data[i] * 2);
        // Report progress every 10%
        if (i % Math.floor(total / 10) === 0) {
          const percentComplete = Math.floor((i / total) * 100);
          workerContext.postMessage(['PROGRESS', { percent: percentComplete }]);
        }
      }

      return result;
    },
    {
      timeout: 30000, // 30 seconds timeout
      onError: error => {
        console.error('Computation error:', error);
      },
      onMessage: message => {
        // Handle progress updates
        if (message.type === 'PROGRESS') {
          setProgress(message.data.percent);
        }
      },
    }
  );

  const handleProcess = async () => {
    try {
      // Generate array with 1000 items
      const data = Array.from({ length: 1000 }, (_, i) => i);
      const result = await workerFn(data);
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

      {workerStatus === 'RUNNING' && (
        <div>
          <p>Progress: {progress}%</p>
          <div
            style={{
              width: '100%',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              height: '20px',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: '#007bff',
                height: '100%',
              }}
            />
          </div>
        </div>
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
    onMessage?: (message: { type: string; data: any }) => void; // Custom message handler
  }
): [
  (...args: Parameters<T>) => Promise<ReturnType<T>>, // Worker function
  'PENDING' | 'RUNNING' | 'SUCCESS' | 'ERROR' | 'TIMEOUT_EXPIRED', // Status
  (status?: WebWorkerStatus) => void, // Terminate function
];
```

## License

MIT
