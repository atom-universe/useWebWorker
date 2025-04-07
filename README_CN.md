# useWebWorker

[![NPM version](https://img.shields.io/npm/v/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)
[![NPM downloads](http://img.shields.io/npm/dm/@atom-universe/use-web-worker.svg?style=flat)](https://npmjs.com/package/@atom-universe/use-web-worker)

[English](README.md) | [中文](README_CN.md)

一个用于简化 Web Worker 使用的 React Hook，支持 TypeScript。

## 特性

- 🚀 简洁的 Web Worker 管理 API
- 💪 完整的 TypeScript 支持，自动类型推断
- 🔄 组件卸载时自动清理
- ⚡ 不阻塞 UI 操作
- 📦 零依赖
- ⏱️ 内置超时处理
- 🔍 全面的错误处理
- 📊 进度报告和自定义消息传递
- 🎯 基于函数的 Worker 创建 - 直接在代码中编写 Worker 逻辑

## 安装

```bash
npm install @atom-universe/use-web-worker
# 或者
pnpm add @atom-universe/use-web-worker
# 或者
yarn add @atom-universe/use-web-worker
```

## 使用示例

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
        // 每完成10%上报一次进度
        if (i % Math.floor(total / 10) === 0) {
          const percentComplete = Math.floor((i / total) * 100);
          workerContext.postMessage(['PROGRESS', { percent: percentComplete }]);
        }
      }

      return result;
    },
    {
      timeout: 30000, // 30 秒超时
      onError: error => {
        console.error('计算错误:', error);
      },
      onMessage: message => {
        // 处理进度更新
        if (message.type === 'PROGRESS') {
          setProgress(message.data.percent);
        }
      },
    }
  );

  const handleProcess = async () => {
    try {
      // 生成包含1000个元素的数组
      const data = Array.from({ length: 1000 }, (_, i) => i);
      const result = await workerFn(data);
      console.log('结果:', result);
    } catch (error) {
      console.error('处理失败:', error);
    }
  };

  return (
    <div>
      <button onClick={handleProcess} disabled={workerStatus === 'RUNNING'}>
        {workerStatus === 'RUNNING' ? '处理中...' : '开始处理'}
      </button>

      {workerStatus === 'RUNNING' && (
        <button onClick={() => workerTerminate('PENDING')}>取消</button>
      )}

      {workerStatus === 'RUNNING' && (
        <div>
          <p>进度: {progress}%</p>
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

## API

```typescript
function useWebWorker<T extends (...args: any[]) => any>(
  fn: T,
  options?: {
    timeout?: number; // 超时时间（毫秒）
    dependencies?: string[]; // 外部依赖
    localDependencies?: Function[]; // 本地函数依赖
    onError?: (error: Error) => void; // 错误回调
    onMessage?: (message: { type: string; data: any }) => void; // 自定义消息处理器
  }
): [
  (...args: Parameters<T>) => Promise<ReturnType<T>>, // Worker 函数
  'PENDING' | 'RUNNING' | 'SUCCESS' | 'ERROR' | 'TIMEOUT_EXPIRED', // 状态
  (status?: WebWorkerStatus) => void, // 终止函数
];
```
