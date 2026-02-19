import dayjs from 'dayjs';

export function today(): string {
  return dayjs().format('YYYY-MM-DD');
}

export function tomorrow(): string {
  return dayjs().add(1, 'day').format('YYYY-MM-DD');
}

export function addDays(date: string, days: number): string {
  return dayjs(date).add(days, 'day').format('YYYY-MM-DD');
}

export function formatRelativeTime(isoTimestamp: string): string {
  const diffMs = Date.now() - new Date(isoTimestamp).getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return dayjs(isoTimestamp).format('MMM D, HH:mm');
}
