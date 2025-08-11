# useWebWorker

<div align="center">
  <img src="assets/uww_128.svg" alt="useWebWorker Logo" width="64" height="64" />
  <h1>useWebWorker</h1>
  <p>A powerful React hook for easy Web Worker integration with TypeScript support, automatic cleanup, and comprehensive error handling.</p>
  
  [![NPM version](https://img.shields.io/npm/v/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)
  [![NPM downloads](http://img.shields.io/npm/dm/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)
  
  <p>
    <strong>📖 <a href="https://use-web-worker-docs.vercel.app/">Documentation</a></strong> |
    <strong>🚀 <a href="https://use-web-worker-docs.vercel.app/">Live Demo</a></strong>
  </p>
</div>

[English](README.md) | [中文](README_CN.md)

## Installation

```bash
npm install @atom-universe/use-web-worker
# or
pnpm add @atom-universe/use-web-worker
# or
yarn add @atom-universe/use-web-worker
```

## Features

- **Zero Dependencies** - Pure React hooks with no external dependencies
- **Function-like API** - Use Web Workers just like calling regular functions
- **TypeScript Support** - Full type safety with generics
- **Automatic Cleanup** - Workers are automatically terminated when components unmount
- **Error Handling** - Comprehensive error handling with timeout support
- **Performance Optimized** - Worker caching mechanism for better performance
- **Lightweight** - Only 1.91 KB gzipped

## Quick Start

### Basic Usage

```tsx
import { useWebWorkerFn } from '@atom-universe/use-web-worker';

function App() {
  const [workerFn, { data, error, loading }] = useWebWorkerFn((a: number, b: number) => a + b);

  const handleClick = async () => {
    const result = await workerFn(1, 2);
    console.log(result); // 3
  };

  return (
    <div>
      <button onClick={handleClick}>Calculate</button>
      {loading && <p>Calculating...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Result: {data}</p>}
    </div>
  );
}
```

### With Dependencies

```tsx
import { useWebWorkerFn } from '@atom-universe/use-web-worker';

function App() {
  const [workerFn] = useWebWorkerFn(
    (data: number[]) => {
      // Use external libraries in worker
      return data.reduce((sum, num) => sum + num, 0);
    },
    {
      dependencies: ['https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'],
    }
  );

  const handleClick = async () => {
    const result = await workerFn([1, 2, 3, 4, 5]);
    console.log(result); // 15
  };

  return <button onClick={handleClick}>Sum Array</button>;
}
```

## API Reference

### useWebWorkerFn

A hook that creates a Web Worker from a function and provides a way to execute it.

```tsx
const [workerFn, { data, error, loading, terminate }] = useWebWorkerFn(
  fn: T,
  options?: UseWebWorkerFnOptions
);
```

#### Parameters

- `fn: T` - The function to run in the Web Worker
- `options?: UseWebWorkerFnOptions` - Configuration options

#### Options

```tsx
interface UseWebWorkerFnOptions {
  dependencies?: string[]; // External script URLs to load
  localDependencies?: string[]; // Local script paths
  timeout?: number; // Timeout in milliseconds
  onError?: (error: Error) => void; // Error callback
}
```

#### Returns

- `workerFn: (...args: Parameters<T>) => Promise<ReturnType<T>>` - Function to execute the worker
- `data: ReturnType<T> | undefined` - Result from the worker
- `error: Error | undefined` - Error if any occurred
- `loading: boolean` - Whether the worker is currently executing
- `terminate: () => void` - Function to terminate the worker

### useWebWorker

A hook for more direct Web Worker control.

```tsx
const [data, post, terminate, status] = useWebWorker(
  script: string | URL,
  options?: UseWebWorkerOptions
);
```

## Performance Features

### Worker Caching

The library implements an intelligent Worker caching mechanism that:

- **Reuses Workers** - Avoids creating new Blob URLs for identical functions
- **Memory Efficient** - Automatically manages Worker lifecycle
- **Performance Boost** - Significantly faster subsequent executions

### Bundle Size

- **Gzipped**: 1.91 KB
- **Minified**: 6.2 KB
- **Uncompressed**: 15.8 KB

## Examples

Check out the [live demo](https://use-web-worker-docs.vercel.app/) for more examples and interactive demonstrations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
