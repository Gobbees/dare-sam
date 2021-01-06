const sleepFor = (seconds: number) =>
  new Promise((r) => setTimeout(r, seconds * 1000));

export default sleepFor;
