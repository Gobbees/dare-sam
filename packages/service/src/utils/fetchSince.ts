import { subDays } from 'date-fns';

/**
 * @returns the current date minus days.
 */
const fetchPageSince = (days: number) => subDays(new Date(), days);

export default fetchPageSince;
