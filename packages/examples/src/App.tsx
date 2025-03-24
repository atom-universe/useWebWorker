import React, { useState } from "react";
import ReverseExample from "./ReverseExample";
import ComputeExample from "./ComputeExample";

export default function App() {
  const [activeTab, setActiveTab] = useState<"reverse" | "compute">("reverse");

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>useWebWorker Examples</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("reverse")}
          style={{
            marginRight: "10px",
            background: activeTab === "reverse" ? "#007bff" : "#f8f9fa",
            color: activeTab === "reverse" ? "white" : "black",
            border: "1px solid #dee2e6",
            padding: "8px 16px",
            borderRadius: "4px",
          }}
        >
          useWebWorker Example
        </button>
        <button
          onClick={() => setActiveTab("compute")}
          style={{
            background: activeTab === "compute" ? "#007bff" : "#f8f9fa",
            color: activeTab === "compute" ? "white" : "black",
            border: "1px solid #dee2e6",
            padding: "8px 16px",
            borderRadius: "4px",
          }}
        >
          useWebWorkerFn Example
        </button>
      </div>

      <div
        style={{
          padding: "20px",
          border: "1px solid #dee2e6",
          borderRadius: "4px",
        }}
      >
        <div style={{ display: activeTab === "reverse" ? "block" : "none" }}>
          <ReverseExample />
        </div>
        <div style={{ display: activeTab === "compute" ? "block" : "none" }}>
          <ComputeExample />
        </div>
      </div>
    </div>
  );
}
