import React, { useState } from 'react';
import { useWebWorkerFn } from '@atom-universe/use-web-worker';

// This is a type declaration for the workerImport function
// The actual implementation is provided by the vite plugin
declare function workerImport<T = any>(path: string): Promise<T>;

export function WorkerImportExample() {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [workerFn] = useWebWorkerFn(async () => {
    // Import libraries - these will be loaded from ESM CDN
    const lodash = await workerImport('lodash-es');
    const map = await workerImport('lodash-es/map');

    // Import local utils
    const utils = await workerImport('./worker-utils.ts');

    return {
      processData: (data: number[]) => {
        const doubled = map(data, (x: number) => x * 2);
        const sum = lodash.sum(doubled);
        return utils.formatResult(sum);
      },
    };
  });

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const result = await workerFn([1, 2, 3, 4, 5]);
      setResult(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Worker Import Example</h2>
      <button onClick={handleCalculate} disabled={loading}>
        Calculate
      </button>
      {result !== null && <p>Result: {result}</p>}
    </div>
  );
}
