const shortDate = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short' });
const dateTime = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
const time = new Intl.DateTimeFormat('es-CL', { hour: '2-digit', minute: '2-digit' });

function parse(iso?: string | null): Date | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatShortDate(iso?: string | null): string {
  const date = parse(iso);
  return date ? shortDate.format(date).replace('.', '') : '';
}

export function formatDateTime(iso?: string | null): string {
  const date = parse(iso);
  return date ? dateTime.format(date) : '';
}

export function formatTime(iso?: string | null): string {
  const date = parse(iso);
  return date ? time.format(date) : '';
}
