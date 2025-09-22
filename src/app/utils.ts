export function getJourneyDuration(departure: string, arrival: string): string {
  const dep = new Date(departure);
  const arr = new Date(arrival);

  const diffMs = arr.getTime() - dep.getTime(); // difference in milliseconds

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}h ${minutes}m`;
}
