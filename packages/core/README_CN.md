# useWebWorker

<div align="center">
  <img src="assets/uww_128.svg" alt="useWebWorker Logo" width="64" height="64" />
  <h1>useWebWorker</h1>
  <p>一个功能强大的 React Hook，用于简化 Web Worker 集成，支持 TypeScript，自动清理和全面的错误处理。</p>
  
  [![NPM version](https://img.shields.io/npm/v/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)
  [![NPM downloads](http://img.shields.io/npm/dm/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)
  
  <p>
    <strong>📖 <a href="https://use-web-worker-docs.vercel.app/">文档</a></strong> |
    <strong>🚀 <a href="https://use-web-worker-docs.vercel.app/">在线演示</a></strong>
  </p>
</div>

[English](README.md) | [中文](README_CN.md)

## 安装

```bash
npm install @atom-universe/use-web-worker
# 或者
pnpm add @atom-universe/use-web-worker
# 或者
yarn add @atom-universe/use-web-worker
```

## 特性

- **零依赖** - 纯 React hooks，无外部依赖
- **函数式 API** - 像调用普通函数一样使用 Web Workers
- **TypeScript 支持** - 完整的类型安全，支持泛型
- **自动清理** - 组件卸载时自动终止 Workers
- **错误处理** - 全面的错误处理和超时支持
- **性能优化** - Worker 缓存机制，提升性能
- **轻量级** - 仅 1.91 KB（压缩后）

## 快速开始

### 基本用法

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
      <button onClick={handleClick}>计算</button>
      {loading && <p>计算中...</p>}
      {error && <p>错误: {error.message}</p>}
      {data && <p>结果: {data}</p>}
    </div>
  );
}
```

### 使用依赖

```tsx
import { useWebWorkerFn } from '@atom-universe/use-web-worker';

function App() {
  const [workerFn] = useWebWorkerFn(
    (data: number[]) => {
      // 在 worker 中使用外部库
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

  return <button onClick={handleClick}>数组求和</button>;
}
```

## API 参考

### useWebWorkerFn

创建一个 Web Worker 函数的 Hook，提供执行方式。

```tsx
const [workerFn, { data, error, loading, terminate }] = useWebWorkerFn(
  fn: T,
  options?: UseWebWorkerFnOptions
);
```

#### 参数

- `fn: T` - 在 Web Worker 中运行的函数
- `options?: UseWebWorkerFnOptions` - 配置选项

#### 选项

```tsx
interface UseWebWorkerFnOptions {
  dependencies?: string[]; // 外部脚本 URL
  localDependencies?: string[]; // 本地脚本路径
  timeout?: number; // 超时时间（毫秒）
  onError?: (error: Error) => void; // 错误回调
}
```

#### 返回值

- `workerFn: (...args: Parameters<T>) => Promise<ReturnType<T>>` - 执行 worker 的函数
- `data: ReturnType<T> | undefined` - worker 的结果
- `error: Error | undefined` - 发生的错误
- `loading: boolean` - worker 是否正在执行
- `terminate: () => void` - 终止 worker 的函数

### useWebWorker

用于更直接控制 Web Worker 的 Hook。

```tsx
const [data, post, terminate, status] = useWebWorker(
  script: string | URL,
  options?: UseWebWorkerOptions
);
```

## 性能特性

### Worker 缓存

该库实现了智能的 Worker 缓存机制：

- **重用 Workers** - 避免为相同函数创建新的 Blob URL
- **内存高效** - 自动管理 Worker 生命周期
- **性能提升** - 后续执行显著更快

### 包大小

- **压缩后**: 1.91 KB
- **压缩前**: 6.2 KB
- **未压缩**: 15.8 KB

## 示例

查看[在线演示](https://use-web-worker-docs.vercel.app/)获取更多示例和交互式演示。

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件。
