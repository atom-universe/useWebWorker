import { useState, useEffect, useRef } from "react";

export interface UseWebWorkerReturn<Data = any> {
  data: Data | undefined;
  post: (message: any) => void;
  terminate: () => void;
  worker: Worker | undefined;
  isRunning: boolean;
}

type WorkerFn = () => Worker;

function useWebWorker<Data = any>(
  url: string | WorkerFn | Worker,
  workerOptions?: WorkerOptions
): UseWebWorkerReturn<Data> {
  const [data, setData] = useState<Data>();
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof url === "string") {
      workerRef.current = new Worker(url, workerOptions);
    } else if (typeof url === "function") {
      workerRef.current = url();
    } else {
      workerRef.current = url;
    }

    workerRef.current.onmessage = (e: MessageEvent) => {
      setData(e.data);
      setIsRunning(false);
    };

    workerRef.current.onerror = (error: ErrorEvent) => {
      console.error("Error in Web Worker:", error);
      setIsRunning(false);
    };

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
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
  };

  return {
    data,
    post,
    terminate,
    worker: workerRef.current ?? undefined,
    isRunning,
  };
}

export default useWebWorker;
