// place files you want to import through the `$lib` alias in this folder.

export function formatEta(eta: { hours: number, minutes: number, seconds: number }) {
  const mins = `${eta.minutes}`.padStart(2, '0');
  const secs = `${eta.seconds}`.padStart(2, '0');
  return `${eta.hours}h${mins}m${secs}s`;
}
