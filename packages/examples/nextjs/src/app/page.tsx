'use client';

import { useState } from 'react';
import Image from 'next/image';
import useWebWorker from '@atom-universe/use-web-worker';

// 定义 WorkerStatusType 枚举值
const WorkerStatusType = {
  SUCCESS: 0,
  ERROR: 1,
  TIMEOUT: 2,
  RUNNING: 3,
  PENDING: 4,
} as const;

import { computeFibonacci } from './utils/fibonacci';

export default function Home() {
  // 使用 BigInt 来处理大数字
  const [number, setNumber] = useState(4000000);
  const [result, setResult] = useState<bigint | null>(null);
  const [progress, setProgress] = useState(0);
  // const [computing, setComputing] = useState(false);

  const [workerFn, workerStatus, workerTerminate] = useWebWorker(computeFibonacci, {
    timeout: 30000,
    onError: (error: Error) => {
      console.error('error:', error);
      // setComputing(false);
    },
    onMessage: (message: { type: string; data: { percent: number } }) => {
      if (message.type === 'PROGRESS') {
        setProgress(message.data.percent);
      }
    },
  });

  const typedWorkerStatus = workerStatus as unknown as number;

  const handleCompute = async () => {
    try {
      setProgress(0);
      // setComputing(true);
      setResult(null);
      const data = await workerFn(BigInt(number));
      setResult(data as unknown as bigint);
    } catch (error) {
      console.error('计算失败:', error);
    }
  };

  const isRunning = typedWorkerStatus === WorkerStatusType.RUNNING;
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="w-full max-w-4xl mt-8 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">useWebWorker Demo</h2>
          <p className="mb-4">
            This example demonstrates how to use the{' '}
            <code className="px-1 rounded">useWebWorker</code> Hook to run CPU-intensive tasks in a
            Web Worker, avoiding blocking the main thread. We use BigInt to handle large numbers
            that would otherwise cause overflow issues.
          </p>

          <div className="mb-4">
            <label className="block mb-2">
              Calculate the
              <input
                type="number"
                value={number}
                onChange={e => setNumber(Number(e.target.value))}
                min="1"
                max="5000000"
                className="mx-2 border rounded px-2 py-1 w-24 border-gray-300 dark:border-gray-600"
                disabled={isRunning}
              />
              th Fibonacci number
            </label>
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <button
              onClick={handleCompute}
              disabled={isRunning}
              className={`px-4 py-2 rounded ${isRunning ? 'bg-gray-400 dark:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'} text-white font-medium`}
            >
              {isRunning ? 'Computing...' : 'Start Computation'}
            </button>

            {isRunning && (
              <button
                onClick={() => workerTerminate()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded font-medium"
              >
                Cancel Computation
              </button>
            )}
          </div>

          <div className="mb-4">
            <p className="mb-2">Progress: {progress}%</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-blue-500 dark:bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {result !== null && (
            <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded">
              <h3 className="text-lg font-semibold mb-2">Result:</h3>
              <p>
                The {number}th Fibonacci number is: <strong>{result?.toString()}</strong>
              </p>
            </div>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
