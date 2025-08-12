/**
 * Compute the Mandelbrot set.
 *
 * Note about `workerContext`:
 * - This is the Web Worker's global scope (aka `self`).
 * - You do NOT pass it when calling the function. It is automatically injected
 *   by `useWebWorkerFn` as the last argument when the function runs inside the worker.
 * - You can use it to send custom messages back to the main thread, e.g.
 *   `workerContext.postMessage(['PROGRESS', { percent }])`.
 */
export function computeMandelbrot(
  width: number,
  height: number,
  maxIterations: number,
  zoom: number,
  workerContext: Worker
) {
  const result: number[] = new Array(width * height);
  const centerX = -0.5;
  const centerY = 0;
  const totalPixels = width * height;
  let processedPixels = 0;
  let lastReportedProgress = 0;

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

      processedPixels++;
      const currentProgress = Math.floor((processedPixels / totalPixels) * 100);
      if (currentProgress >= lastReportedProgress + 5) {
        lastReportedProgress = currentProgress;
        workerContext.postMessage(['PROGRESS', { percent: currentProgress }]);
      }
    }
  }

  return result;
}
