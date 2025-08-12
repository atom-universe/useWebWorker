export enum WorkerStatusType {
  SUCCESS = 0,
  ERROR = 1,
  TIMEOUT = 2,
  RUNNING = 3,
  PENDING = 4,
}

export type WebWorkerStatus =
  | WorkerStatusType.PENDING
  | WorkerStatusType.SUCCESS
  | WorkerStatusType.ERROR
  | WorkerStatusType.TIMEOUT
  | WorkerStatusType.RUNNING;

// Worker cache to avoid creating duplicate blobs
const workerCache = new Map<string, string>();

function createWorkerBlobUrl(
  fn: (...args: any[]) => any,
  dependencies: string[] = [],
  localDependencies: ((...args: any[]) => any)[] = []
) {
  const cacheKey = `${fn.toString()}_${JSON.stringify(dependencies)}_${localDependencies.length}`;

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
    self.postMessage([${WorkerStatusType.SUCCESS}, result]);
  } catch (error) {
    self.postMessage([${WorkerStatusType.ERROR}, error.message]);
  }
}`;

  const blob = new Blob([blobCode], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);

  workerCache.set(cacheKey, url);

  return url;
}

export default createWorkerBlobUrl;
