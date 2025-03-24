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
  const { data, post, isRunning } = useWebWorker(
    new URL('./worker.ts', import.meta.url)
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
import { useWebWorker } from '@atom-universe/use-web-worker';

function FunctionExample() {
  const { data, post, isRunning } = useWebWorker(() => {
    // Create and configure worker inline
    const worker = new Worker(
      new URL('./worker.ts', import.meta.url),
      { type: 'module' }
    );
    
    // Add event listeners or configure worker
    worker.onerror = (error) => {
      console.error('Worker error:', error);
    };
    
    return worker;
  });

  const handleProcess = () => {
    post({ type: 'COMPUTE', data: [1, 2, 3] });
  };

  return (
    <button onClick={handleProcess} disabled={isRunning}>
      {isRunning ? 'Computing...' : 'Start Computation'}
    </button>
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
  data: Data | undefined;
  post: (message: any) => void;
  terminate: () => void;
  worker: Worker | undefined;
  isRunning: boolean;
}
```

## License

MIT
