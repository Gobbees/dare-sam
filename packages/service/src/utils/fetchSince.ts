/**
 * @returns the current date minus days.
 */
const fetchPageSince = (days: number) =>
  new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * days);

export default fetchPageSince;
