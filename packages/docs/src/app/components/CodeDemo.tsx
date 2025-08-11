'use client';

import { useState, useEffect } from 'react';
import { Prism } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import clipboard from 'clipboard-js';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { CopyButton } from './CopyButton';

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
  const [copied, setCopied] = useState(false);

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
    <div className="glass p-1 rounded-lg pos-relative">
      <div className="pos-absolute pos-top-2 pos-right-2 pos-z-10">
        <CopyButton text={codeExample} />
      </div>

      <SyntaxHighlighter
        language="typescript"
        style={oneDark}
        customStyle={{
          margin: 0,
          // background: 'transparent',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
        showLineNumbers
        wrapLines
      >
        {codeExample}
      </SyntaxHighlighter>
    </div>
  );
}
