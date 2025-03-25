export type WebWorkerStatus =
  | "PENDING"
  | "SUCCESS"
  | "RUNNING"
  | "ERROR"
  | "TIMEOUT_EXPIRED";

function createWorkerBlobUrl(
  fn: Function,
  dependencies: string[] = [],
  localDependencies: Function[] = []
) {
  const blobCode = `
    ${dependencies.map((d) => `importScripts("${d}");`).join("\n")}
    ${localDependencies.map((f) => `${f.toString()}`).join("\n")}
    
    const fnString = ${fn.toString()};
    
    self.onmessage = async function(e) {
      const [args] = e.data;
      try {
        const result = await fnString.apply(null, args);
        self.postMessage(['SUCCESS', result]);
      } catch (error) {
        self.postMessage(['ERROR', error.message]);
      }
    }
  `;

  const blob = new Blob([blobCode], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);

  return url;
}

export default createWorkerBlobUrl;
