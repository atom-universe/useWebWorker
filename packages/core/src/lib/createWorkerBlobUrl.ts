export const enum WorkerMessageType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  TIMEOUT_EXPIRED = 'TIMEOUT_EXPIRED',
  RUNNING = 'RUNNING',
  PENDING = 'PENDING',
}

export type WebWorkerStatus =
  | WorkerMessageType.PENDING
  | WorkerMessageType.SUCCESS
  | WorkerMessageType.ERROR
  | WorkerMessageType.TIMEOUT_EXPIRED
  | WorkerMessageType.RUNNING;

function createWorkerBlobUrl(
  fn: (...args: any[]) => any,
  dependencies: string[] = [],
  localDependencies: ((...args: any[]) => any)[] = []
) {
  const blobCode = `
${dependencies.map(d => `importScripts("${d}");`).join('\n')}
${localDependencies.map(f => `${f.toString()}`).join('\n')}
const fnString = ${fn.toString()};
self.onmessage = async function(e) {
  const [args] = e.data;
  try {
    const result = await fnString.apply(null, [...args, self]);
    self.postMessage(['${WorkerMessageType.SUCCESS}', result]);
  } catch (error) {
    self.postMessage(['${WorkerMessageType.ERROR}', error.message]);
  }
}`;

  const blob = new Blob([blobCode], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);

  return url;
}

export default createWorkerBlobUrl;
