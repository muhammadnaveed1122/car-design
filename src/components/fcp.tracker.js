export function trackFCP() {
  const paintObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    for (const entry of entries) {
      if (entry.name === "first-contentful-paint") {
        console.log("FCP:", entry.startTime, entry);
      }
    }
  });
  paintObserver.observe({ type: "paint", buffered: true });
}
