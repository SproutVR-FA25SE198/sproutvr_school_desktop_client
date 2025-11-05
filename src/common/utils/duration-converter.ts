/**
 * Converts { minutes, seconds } or raw numbers into "HH:mm:ss" format.
 * Example:
 *   formatDurationToHHMMSS({ minutes: 30, seconds: 0 }) → "00:30:00"
 *   formatDurationToHHMMSS({ minutes: 75, seconds: 5 }) → "01:15:05"
 */
export function DurationToHHMMSS(duration: { minutes: number; seconds: number }): string {
  const totalSeconds = duration.minutes * 60 + duration.seconds;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // padStart ensures two digits (e.g., "07", "00")
  return [String(hours).padStart(2, '0'), String(minutes).padStart(2, '0'), String(seconds).padStart(2, '0')].join(':');
}

export function HHMMSSToDuration(value: string): { minutes: number; seconds: number } {
  const [h, m, s] = value.split(':').map(Number);
  return {
    minutes: h * 60 + m,
    seconds: s,
  };
}
