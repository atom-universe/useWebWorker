import React, { useState } from 'react';
import useWebWorker, { WorkerStatusType } from '@atom-universe/use-web-worker';
import { computeMandelbrot } from './utils';

export default function ComputeExample() {
  const [size, setSize] = useState(300);
  const [maxIterations, setMaxIterations] = useState(1000);
  const [zoom, setZoom] = useState(0.5);
  const [result, setResult] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [computing, setComputing] = useState(false);

  const [workerFn, workerStatus, workerTerminate] = useWebWorker(computeMandelbrot, {
    timeout: 30000, // 30 seconds timeout
    onError: (error: Error) => {
      console.error('Computation error:', error);
      setComputing(false);
    },
    onMessage: (message: { type: string; data: any }) => {
      if (message.type === 'PROGRESS') {
        setProgress(message.data.percent);
      }
    },
  });

  const handleCompute = async () => {
    try {
      setProgress(0);
      setComputing(true);
      const data = await workerFn(size, size, maxIterations, zoom);
      setResult(data);
      setComputing(false);
    } catch (error) {
      console.error('Failed to compute:', error);
      setComputing(false);
    }
  };

  return (
    <div>
      <h2>Mandelbrot Set Example</h2>
      <p>
        This example uses <code>useWebWorkerFn</code> to compute the Mandelbrot set.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '20px' }}>
            Size:
            <input
              type="number"
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              min={100}
              max={1000}
              style={{ marginLeft: '10px' }}
            />
          </label>
          <label style={{ marginRight: '20px' }}>
            Max Iterations:
            <input
              type="number"
              value={maxIterations}
              onChange={e => setMaxIterations(Number(e.target.value))}
              min={100}
              max={5000}
              style={{ marginLeft: '10px' }}
            />
          </label>
          <label>
            Zoom:
            <input
              type="number"
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              min={0.1}
              max={2}
              step={0.1}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        {(() => {
          const isRunning = workerStatus === WorkerStatusType.RUNNING;
          return (
            <button
              onClick={handleCompute}
              disabled={isRunning}
              style={{
                padding: '8px 16px',
                background: isRunning ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isRunning ? 'not-allowed' : 'pointer',
              }}
            >
              {isRunning ? 'Computing...' : 'Compute Mandelbrot'}
            </button>
          );
        })()}

        {workerStatus === WorkerStatusType.RUNNING && (
          <button
            onClick={() => workerTerminate(WorkerStatusType.PENDING)}
            style={{
              marginLeft: '10px',
              padding: '8px 16px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* 进度条 */}
      {computing && (
        <div style={{ marginBottom: '20px' }}>
          <p>Computing: {progress}% complete</p>
          <div
            style={{
              width: '100%',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              height: '20px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: '#007bff',
                height: '100%',
                transition: 'width 0.3s ease-in-out',
              }}
            ></div>
          </div>
        </div>
      )}

      {result.length > 0 && (
        <div>
          <h3>Result:</h3>
          <canvas
            ref={canvas => {
              if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  const imageData = ctx.createImageData(size, size);
                  for (let i = 0; i < result.length; i++) {
                    const value = result[i];
                    const color = value === maxIterations ? 0 : (value * 255) / maxIterations;
                    imageData.data[i * 4] = color; // R
                    imageData.data[i * 4 + 1] = color; // G
                    imageData.data[i * 4 + 2] = color; // B
                    imageData.data[i * 4 + 3] = 255; // A
                  }
                  canvas.width = size;
                  canvas.height = size;
                  ctx.putImageData(imageData, 0, 0);
                }
              }
            }}
            style={{
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              maxWidth: '100%',
            }}
          />
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <strong>Note:</strong> The Mandelbrot set computation is CPU intensive. Using a Web Worker
        prevents it from blocking the UI thread.
      </div>
    </div>
  );
}
