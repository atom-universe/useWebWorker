# useWebWorker

<div align="center">
  <img src="assets/uww_128.svg" alt="useWebWorker Logo" width="64" height="64" />
  <h1>useWebWorker</h1>
  <p>
    <a href="README_CN.md">中文</a> | <strong>English</strong>
  </p>
  <p>A powerful React hook for easy Web Worker integration with TypeScript support, automatic cleanup, and comprehensive error handling.</p>
  
  [![NPM version](https://img.shields.io/npm/v/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)
  [![NPM downloads](http://img.shields.io/npm/dm/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)
  
  <p>
    📖 For more information, read 👉
    <strong><a href="https://use-web-worker-docs.vercel.app/">Documentation</a></strong> 👈
  </p>
</div>

## Quick Start

```bash
npm install @atom-universe/use-web-worker
```

## Features

- **Zero Dependencies, Lightweight** - Pure React hooks with no external dependencies
- **Function-like API** - Use Web Workers just like calling regular functions
- **Automatic Cleanup** - Workers are automatically terminated when components unmount

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
