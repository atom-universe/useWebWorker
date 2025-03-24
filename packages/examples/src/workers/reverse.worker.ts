/// <reference lib="webworker" />

self.onmessage = (e: MessageEvent) => {
  try {
    const { list } = e.data;
    if (!Array.isArray(list)) {
      throw new Error("Input must be an array");
    }
    const reversed = list.reverse();
    self.postMessage(reversed);
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
