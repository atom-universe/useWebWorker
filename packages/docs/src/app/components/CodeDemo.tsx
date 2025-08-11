'use client';

import { useState, useEffect } from 'react';
import { Prism } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SyntaxHighlighter = Prism as any;

const codeExample = `import useWebWorker from '@atom-universe/use-web-worker';

function App() {
  const [result, setResult] = useState(null);
  
  const [workerFn, status] = useWebWorker(
    // This function runs in a Web Worker
    (data) => {
      // Heavy computation that won't block the UI
      const result = data.map(x => x * x).reduce((a, b) => a + b, 0);
      return result;
    }
  );

  const handleCalculate = async () => {
    const data = Array.from({length: 1000000}, (_, i) => i);
    const result = await workerFn(data);
    setResult(result);
  };

  return (
    <div>
      <button onClick={handleCalculate}>
        Calculate (Non-blocking!)
      </button>
      <p>Status: {status}</p>
      <p>Result: {result}</p>
    </div>
  );
}`;

export function CodeDemo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="glass p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-600 rounded w-full mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-1 rounded-lg">
      <div className="flex items-center justify-between p-4 my-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        {/* <span className="text-sm text-gray-400">useWebWorker.tsx</span> */}
      </div>

      <div className="overflow-hidden rounded-b-lg">
        <SyntaxHighlighter
          language="typescript"
          style={oneDark}
          customStyle={{
            margin: 0,
            background: 'transparent',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          showLineNumbers
          wrapLines
        >
          {codeExample}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
