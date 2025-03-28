import { useState, useEffect, useRef } from 'react';

export type UseWebWorkerReturn<Data = any> = [
  Data | undefined,
  (message: any) => void,
  () => void,
  Worker | undefined,
  boolean,
];

type WorkerFn = () => Worker;

function useWebWorker<Data = any>(
  url: string | WorkerFn | Worker,
  workerOptions?: WorkerOptions
): UseWebWorkerReturn<Data> {
  const [data, setData] = useState<Data>();
  const [isRunning, setIsRunning] = useState(false);
  const [worker, setWorker] = useState<Worker>();
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof url === 'string') {
      workerRef.current = new Worker(url, workerOptions);
    } else if (typeof url === 'function') {
      workerRef.current = url();
    } else {
      workerRef.current = url;
    }

    setWorker(workerRef.current);

    workerRef.current.onmessage = (e: MessageEvent) => {
      setData(e.data);
      setIsRunning(false);
    };

    workerRef.current.onerror = (error: ErrorEvent) => {
      console.error('Error in Web Worker:', error);
      setIsRunning(false);
    };

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
      setWorker(undefined);
    };
  }, [url]);

  const post = (message: any) => {
    if (!workerRef.current) return;
    setIsRunning(true);
    workerRef.current.postMessage(message);
  };

  const terminate = () => {
    if (!workerRef.current) return;
    workerRef.current.terminate();
    workerRef.current = null;
    setWorker(undefined);
  };

  return [data, post, terminate, worker, isRunning];
}

export default useWebWorker;
