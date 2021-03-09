export default {
  // time between each service run in seconds. Must be positive and > 3600.
  timeInterval: 3600,
  // fetch interval for the workers: numbers of days to
  // subtract to the current date to calculate the fetch interval
  fetchSinceDays: 30,
  computeSentiment: true,
};
