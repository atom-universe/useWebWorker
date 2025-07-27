export const enum WorkerMessageType {
  SUCCESS = 0,
  ERROR = 1,
  TIMEOUT_EXPIRED = 2,
  RUNNING = 3,
  PENDING = 4,
}

export type WebWorkerStatus =
  | WorkerMessageType.PENDING
  | WorkerMessageType.SUCCESS
  | WorkerMessageType.ERROR
  | WorkerMessageType.TIMEOUT_EXPIRED
  | WorkerMessageType.RUNNING;

// Worker cache to avoid creating duplicate blobs
const workerCache = new Map<string, string>();

function createWorkerBlobUrl(
  fn: (...args: any[]) => any,
  dependencies: string[] = [],
  localDependencies: ((...args: any[]) => any)[] = []
) {
  // Create cache key from function and dependencies
  const cacheKey = `${fn.toString()}_${JSON.stringify(dependencies)}_${localDependencies.length}`;

  // Return cached URL if exists
  if (workerCache.has(cacheKey)) {
    return workerCache.get(cacheKey)!;
  }

  const blobCode = `
${dependencies.map(d => `importScripts("${d}");`).join('\n')}
${localDependencies.map(f => `${f.toString()}`).join('\n')}
const fnString = ${fn.toString()};
self.onmessage = async function(e) {
  const [args] = e.data;
  try {
    const result = await fnString.apply(null, [...args, self]);
    self.postMessage([${WorkerMessageType.SUCCESS}, result]);
  } catch (error) {
    self.postMessage([${WorkerMessageType.ERROR}, error.message]);
  }
}`;

  const blob = new Blob([blobCode], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);

  // Cache the URL
  workerCache.set(cacheKey, url);

  return url;
}

export default createWorkerBlobUrl;
