export default function getDaysBetweenDates(startDate: Date, endDate: Date): number {
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error('Both arguments must be Date objects.');
  }
  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const daysBetween = differenceInMilliseconds / millisecondsInADay;
  return Math.abs(Math.floor(daysBetween));
}
