# useWebWorker

[![NPM version](https://img.shields.io/npm/v/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)
[![NPM downloads](http://img.shields.io/npm/dm/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)

[English](README.md) | [中文](README_CN.md)

一个用于简化 Web Worker 使用的 React Hook，支持 TypeScript。

## 特性

- 🚀 简洁的 Web Worker 管理 API
- 💪 完整的 TypeScript 支持
- 🔄 组件卸载时自动清理
- ⚡ 不阻塞 UI 操作
- 📦 零依赖

## 安装

```bash
npm install @atom-universe/use-web-worker
# 或者
pnpm add @atom-universe/use-web-worker
# 或者
yarn add @atom-universe/use-web-worker
```

## 使用示例

### 文件模式

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
      {isRunning ? '处理中...' : '开始处理'}
    </button>
  );
}

// worker.ts
self.onmessage = (e) => {
  const data = e.data;
  // 处理数据
  self.postMessage(data.reverse());
};
```

### 函数模式

```tsx
import { useWebWorkerFn } from '@atom-universe/use-web-worker';

function FunctionExample() {
  const { workerFn, workerStatus, workerTerminate } = useWebWorkerFn(
    (data) => {
      // 你的计算逻辑
      return data.reverse();
    },
    {
      timeout: 30000, // 30 秒超时
      onError: (error) => {
        console.error('计算错误:', error);
      },
    }
  );

  const handleProcess = async () => {
    try {
      const result = await workerFn([1, 2, 3]);
      console.log('结果:', result);
    } catch (error) {
      console.error('处理失败:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={handleProcess} 
        disabled={workerStatus === 'RUNNING'}
      >
        {workerStatus === 'RUNNING' ? '处理中...' : '开始处理'}
      </button>
      
      {workerStatus === 'RUNNING' && (
        <button onClick={() => workerTerminate('PENDING')}>
          取消
        </button>
      )}
    </div>
  );
}
```

## API

### useWebWorker

```typescript
function useWebWorker<Data = any>(
  url: string | (() => Worker) | Worker,
  options?: WorkerOptions
): {
  data: Data | undefined;           // Worker 返回的数据
  post: (message: any) => void;     // 发送消息给 Worker
  terminate: () => void;            // 终止 Worker
  worker: Worker | undefined;       // Worker 实例
  isRunning: boolean;               // Worker 是否正在运行
}
```

### useWebWorkerFn

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

## 开源协议

MIT