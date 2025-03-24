import React, { useEffect, useState } from "react";
import { useWebWorker } from "@use-web-worker/core";

const generateArray = (size: number) =>
  Array.from({ length: size }, (_, i) => i + 1);

export default function ReverseExample() {
  const [size, setSize] = useState(1000000);
  const [list, setList] = useState(() => generateArray(size));
  const [firstItems, setFirstItems] = useState<number[]>([]);

  const {
    data: result,
    post: run,
    isRunning,
  } = useWebWorker<number[]>(() => {
    const worker = new Worker(
      new URL("./workers/reverse.worker.ts", import.meta.url)
    );
    return worker;
  });

  const handleReverse = () => {
    if (!isRunning) {
      run({ list });
    }
  };

  const handleReset = () => {
    setList(generateArray(size));
  };

  useEffect(() => {
    if (result) {
      setList(result);
      setFirstItems(result.slice(0, 5));
    }
  }, [result]);

  useEffect(() => {
    setFirstItems(list.slice(0, 5));
  }, [list]);

  return (
    <div>
      <h2>Array Reverse Example</h2>
      <p>
        This example uses <code>useWebWorker</code> to reverse a large array
        without blocking the UI.
      </p>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>
          Array Size:
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <button onClick={handleReset} style={{ marginLeft: "10px" }}>
          Reset Array
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleReverse}
          disabled={isRunning}
          style={{
            padding: "8px 16px",
            background: isRunning ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          {isRunning ? "Reversing..." : "Reverse Array"}
        </button>
      </div>

      <div>
        <h3>First 5 items:</h3>
        <pre
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(firstItems, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Note:</strong> Try clicking other buttons while the array is
          being reversed. The UI remains responsive!
        </p>
      </div>
    </div>
  );
}
