self.onmessage = (e: MessageEvent) => {
  const { list } = e.data;
  // Simulate some heavy computation
  const reversed = [...list].reverse();
  self.postMessage(reversed);
};
