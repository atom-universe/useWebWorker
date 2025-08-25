/**
 * Calculate the nth term of the Fibonacci sequence
 * This is a CPU-intensive task suitable for running in a Web Worker
 *
 * @param n - The term of the Fibonacci sequence to calculate
 * @param workerContext - Web Worker context for sending progress updates
 * @returns The nth term of the Fibonacci sequence
 */
export function computeFibonacci(n: number, workerContext: Worker): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let a = 0;
  let b = 1;

  // Send progress information
  workerContext.postMessage(['PROGRESS', { percent: 0 }]);

  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;

    // Send progress update every 10%
    const progress = Math.floor((i / n) * 100);
    if (progress % 10 === 0) {
      workerContext.postMessage(['PROGRESS', { percent: progress }]);
    }
  }

  workerContext.postMessage(['PROGRESS', { percent: 100 }]);
  return b;
}
