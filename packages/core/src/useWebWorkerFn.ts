import { useState, useEffect, useRef } from 'react';
import createWorkerBlobUrl, {
  WebWorkerStatus,
  WorkerMessageType,
} from './lib/createWorkerBlobUrl.js';

export interface UseWebWorkerFnOptions {
  timeout?: number;
  /**
   * An array that contains the external dependencies needed to run the worker
   */
  dependencies?: string[];
  /**
   * An array that contains the local dependencies needed to run the worker
   */
  localDependencies?: ((...args: unknown[]) => unknown)[];
  onError?: (error: Error) => void;
  onMessage?: (message: any) => void;
}

export type UseWebWorkerFnReturn<T extends (...args: any[]) => any> = [
  (...fnArgs: Parameters<T>) => Promise<ReturnType<T>>,
  WebWorkerStatus,
  (status?: WebWorkerStatus) => void,
];

function useWebWorkerFn<T extends (...args: any[]) => any>(
  fn: T,
  options: UseWebWorkerFnOptions = {}
): UseWebWorkerFnReturn<T> {
  const { dependencies = [], localDependencies = [], timeout, onError } = options;

  const [workerStatus, setWorkerStatus] = useState<WebWorkerStatus>(WorkerMessageType.PENDING);
  const workerRef = useRef<(Worker & { _url?: string }) | null>(null);
  const promiseRef = useRef<{
    resolve?: (result: ReturnType<T>) => void;
    reject?: (error: Error) => void;
  }>({});
  const timeoutRef = useRef<number>();

  const workerTerminate = (status: WebWorkerStatus = WorkerMessageType.PENDING) => {
    if (workerRef.current && workerRef.current._url) {
      workerRef.current.terminate();
      URL.revokeObjectURL(workerRef.current._url);
      promiseRef.current = {};
      workerRef.current = null;
      window.clearTimeout(timeoutRef.current);
      setWorkerStatus(status);
    }
  };

  const generateWorker = () => {
    const blobUrl = createWorkerBlobUrl(fn, dependencies, localDependencies);
    const newWorker = new Worker(blobUrl) as Worker & { _url?: string };
    newWorker._url = blobUrl;

    newWorker.onmessage = (e: MessageEvent) => {
      const { resolve, reject } = promiseRef.current;
      const [status, result] = e.data as [number, any];

      switch (status) {
        case WorkerMessageType.SUCCESS: {
          resolve?.(result);
          workerTerminate(WorkerMessageType.SUCCESS);
          break;
        }
        case WorkerMessageType.TIMEOUT_EXPIRED: {
          const timeoutError = new Error('Timeout');
          onError?.(timeoutError);
          reject?.(timeoutError);
          workerTerminate(WorkerMessageType.TIMEOUT_EXPIRED);
          break;
        }
        case WorkerMessageType.ERROR: {
          const error = new Error(result as string);
          onError?.(error);
          reject?.(error);
          workerTerminate(WorkerMessageType.ERROR);
          break;
        }
        default: {
          options.onMessage?.({ type: status, data: result });
        }
      }
    };

    newWorker.onerror = (e: ErrorEvent) => {
      const { reject } = promiseRef.current;
      e.preventDefault();
      const error = new Error(e.message);
      onError?.(error);
      reject?.(error);
      workerTerminate(WorkerMessageType.ERROR);
    };

    if (timeout) {
      timeoutRef.current = window.setTimeout(() => {
        const { reject } = promiseRef.current;
        reject?.(new Error('Timeout'));
        workerTerminate(WorkerMessageType.TIMEOUT_EXPIRED);
      }, timeout);
    }

    return newWorker;
  };

  const callWorker = (...fnArgs: Parameters<T>) =>
    new Promise<ReturnType<T>>((resolve, reject) => {
      promiseRef.current = { resolve, reject };
      workerRef.current?.postMessage([fnArgs]);
      setWorkerStatus(WorkerMessageType.RUNNING);
    });

  const workerFn = (...fnArgs: Parameters<T>) => {
    if (workerStatus === WorkerMessageType.RUNNING) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[useWebWorkerFn] You can only run one instance of the worker at a time.');
      }
      return Promise.reject(new Error('Worker is already running'));
    }

    workerRef.current = generateWorker();
    return callWorker(...fnArgs);
  };

  useEffect(() => {
    return () => {
      workerTerminate();
    };
  }, []);

  return [workerFn, workerStatus, workerTerminate];
}

export default useWebWorkerFn;
