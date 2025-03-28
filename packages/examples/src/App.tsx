import React from 'react';
import ComputeExample from './ComputeExample';

export default function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>useWebWorker Examples</h1>

      <div
        style={{
          padding: '20px',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
        }}
      >
        <ComputeExample />
      </div>
    </div>
  );
}
