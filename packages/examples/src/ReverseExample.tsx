import React, { useEffect, useState, useCallback } from "react";
import { useWebWorker } from "@atom-universe/use-web-worker";

const generateArray = (size: number) =>
  Array.from({ length: size }, (_, i) => i + 1);

export default function ReverseExample() {
  const [size, setSize] = useState(114_514_00);
  const [list, setList] = useState(() => generateArray(size));
  const [firstItems, setFirstItems] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    data: result,
    post: run,
    isRunning,
  } = useWebWorker<number[] | { error: string }>(
    new URL("./workers/reverse.worker.ts", import.meta.url).href
  );

  const handleReverse = useCallback(() => {
    if (!isRunning) {
      console.log("Starting reverse operation with list length:", list.length);
      setError(null);
      run({ list: [...list] });
    }
  }, [isRunning, list, run]);

  const handleReset = useCallback(() => {
    console.log("Resetting array with size:", size);
    setError(null);
    setList(generateArray(size));
  }, [size]);

  const handleSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSize = Number(e.target.value);
      console.log("Size changed to:", newSize);
      setSize(newSize);
      setList(generateArray(newSize));
    },
    []
  );

  useEffect(() => {
    if (result) {
      console.log("Received result from worker");
      if (Array.isArray(result)) {
        setList(result);
        setFirstItems(result.slice(0, 5));
      } else if ("error" in result) {
        console.error("Received error from worker:", result.error);
        setError(result.error);
      }
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
            onChange={handleSizeChange}
            min={1}
            max={10000000}
            style={{ marginLeft: "10px" }}
          />
        </label>
        <button
          onClick={handleReset}
          style={{ marginLeft: "10px" }}
          disabled={isRunning}
        >
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

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
          }}
        >
          Error: {error}
        </div>
      )}

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

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p>Current array length: {list.length}</p>
        <p>Worker status: {isRunning ? "Running" : "Idle"}</p>
      </div>
    </div>
  );
}
