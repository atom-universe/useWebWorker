import React, { useState } from 'react';
import useWebWorker from '@atom-universe/use-web-worker';

function computeMandelbrot(width: number, height: number, maxIterations: number, zoom: number) {
  const result: number[] = new Array(width * height);
  const centerX = -0.5;
  const centerY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const x0 = (x - width / 2) / (width * zoom) + centerX;
      const y0 = (y - height / 2) / (height * zoom) + centerY;

      let xi = x0;
      let yi = y0;
      let iteration = 0;

      while (iteration < maxIterations && xi * xi + yi * yi <= 4) {
        const xtemp = xi * xi - yi * yi + x0;
        yi = 2 * xi * yi + y0;
        xi = xtemp;
        iteration++;
      }

      result[y * width + x] = iteration;
    }
  }

  return result;
}

export default function ComputeExample() {
  const [size, setSize] = useState(300);
  const [maxIterations, setMaxIterations] = useState(1000);
  const [zoom, setZoom] = useState(0.5);
  const [result, setResult] = useState<number[]>([]);

  const [workerFn, workerStatus, workerTerminate] = useWebWorker(computeMandelbrot, {
    timeout: 30000, // 30 seconds timeout
    onError: error => {
      console.error('Computation error:', error);
    },
  });

  const handleCompute = async () => {
    try {
      const data = await workerFn(size, size, maxIterations, zoom);
      setResult(data);
    } catch (error) {
      console.error('Failed to compute:', error);
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

        <button
          onClick={handleCompute}
          disabled={workerStatus === 'RUNNING'}
          style={{
            padding: '8px 16px',
            background: workerStatus === 'RUNNING' ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: workerStatus === 'RUNNING' ? 'not-allowed' : 'pointer',
          }}
        >
          {workerStatus === 'RUNNING' ? 'Computing...' : 'Compute Mandelbrot'}
        </button>

        {workerStatus === 'RUNNING' && (
          <button
            onClick={() => workerTerminate('PENDING')}
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
