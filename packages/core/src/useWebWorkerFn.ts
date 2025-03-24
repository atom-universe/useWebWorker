import { useState, useEffect, useRef } from "react";
import createWorkerBlobUrl, {
  WebWorkerStatus,
} from "./lib/createWorkerBlobUrl";

export interface UseWebWorkerFnOptions {
  timeout?: number;
  /**
   * An array that contains the external dependencies needed to run the worker
   */
  dependencies?: string[];
  /**
   * An array that contains the local dependencies needed to run the worker
   */
  localDependencies?: Function[];
  onError?: (error: Error) => void;
}

export interface UseWebWorkerFnReturn<T extends (...args: any[]) => any> {
  workerFn: (...fnArgs: Parameters<T>) => Promise<ReturnType<T>>;
  workerStatus: WebWorkerStatus;
  workerTerminate: (status?: WebWorkerStatus) => void;
}

function useWebWorkerFn<T extends (...args: any[]) => any>(
  fn: T,
  options: UseWebWorkerFnOptions = {}
): UseWebWorkerFnReturn<T> {
  const {
    dependencies = [],
    localDependencies = [],
    timeout,
    onError,
  } = options;

  const [workerStatus, setWorkerStatus] = useState<WebWorkerStatus>("PENDING");
  const workerRef = useRef<(Worker & { _url?: string }) | null>(null);
  const promiseRef = useRef<{
    resolve?: (result: ReturnType<T>) => void;
    reject?: (error: Error) => void;
  }>({});
  const timeoutRef = useRef<number>();

  const workerTerminate = (status: WebWorkerStatus = "PENDING") => {
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
      const { resolve = () => {}, reject = () => {} } = promiseRef.current;
      const [status, result] = e.data as [WebWorkerStatus, ReturnType<T>];

      switch (status) {
        case "SUCCESS":
          resolve(result);
          workerTerminate(status);
          break;
        default:
          const error = new Error(result as string);
          onError?.(error);
          reject(error);
          workerTerminate("ERROR");
          break;
      }
    };

    newWorker.onerror = (e: ErrorEvent) => {
      const { reject = () => {} } = promiseRef.current;
      e.preventDefault();
      const error = new Error(e.message);
      onError?.(error);
      reject(error);
      workerTerminate("ERROR");
    };

    if (timeout) {
      timeoutRef.current = window.setTimeout(() => {
        workerTerminate("TIMEOUT_EXPIRED");
      }, timeout);
    }

    return newWorker;
  };

  const callWorker = (...fnArgs: Parameters<T>) =>
    new Promise<ReturnType<T>>((resolve, reject) => {
      promiseRef.current = { resolve, reject };
      workerRef.current?.postMessage([fnArgs]);
      setWorkerStatus("RUNNING");
    });

  const workerFn = (...fnArgs: Parameters<T>) => {
    if (workerStatus === "RUNNING") {
      console.error(
        "[useWebWorkerFn] You can only run one instance of the worker at a time."
      );
      return Promise.reject(new Error("Worker is already running"));
    }

    workerRef.current = generateWorker();
    return callWorker(...fnArgs);
  };

  useEffect(() => {
    return () => {
      workerTerminate();
    };
  }, []);

  return {
    workerFn,
    workerStatus,
    workerTerminate,
  };
}

export default useWebWorkerFn;
