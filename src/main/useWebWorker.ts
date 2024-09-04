import { useState, useEffect, useRef } from "react";

export type UseWebWorkerResult<T> = [
  run: (params: any) => void,
  isRunning: boolean,
  result: T | undefined
];

function useWebWorker<T>(
  workerFunction: (context: any) => void
): UseWebWorkerResult<T> {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<T | undefined>(undefined);
  const workerRef = useRef<Worker | null>(null);

  const createWorker = (params?: any) => {
    // const workerFunctionWithContext = () => {
    //   workerFunction(setResult, params);
    // };
    const functionString = workerFunction.toString();
    if (typeof functionString !== "string") {
      throw "error: useWebWorker param is not a function...";
    }
    // const functionBody = functionString.slice(
    //   functionString.indexOf("{") + 1,
    //   functionString.lastIndexOf("}")
    // );
    // 

    const template = `
      self.onmessage = function(event) {
        const data = event.data.context;
        const result = (${functionString})(data)
        self.postMessage({ type: "result", value: result });
      };
    `;
    const blob = new Blob([template], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl, { type: "module" });
    return worker;
  };

  const run = (context?: any) => {
    if (!isRunning) {
      setIsRunning(true)
      workerRef.current = createWorker(context);
      workerRef.current.onmessage = (event) => {
        const data = event.data;
        if (data.type === "result") {
          setResult(data.value as T);
          setIsRunning(false);
        } else if (data.type === "error") {
          console.error("Error in Web Worker:", data.error);
          setIsRunning(false);
        }
      };
      workerRef.current.onerror = (error) => {
        console.error("Error in Web Worker:", error);
        setIsRunning(false);
      };
      workerRef.current.postMessage({ type: "init", context });
    }
  };

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  return [run, isRunning, result];
}

export default useWebWorker;
