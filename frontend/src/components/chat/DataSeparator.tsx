type DateSeparatorProps = {
  date: string;
};

const CHILE_TIME_ZONE = 'America/Santiago';

type DateParts = {
  day: number;
  month: number;
  year: number;
};

function getDateParts(value: string | Date): DateParts | null {
    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: CHILE_TIME_ZONE,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).formatToParts(date);

    const year  = Number(parts.find((part) => part.type === 'year')?.value);
    const month = Number(parts.find((part) => part.type === 'month')?.value);
    const day   = Number(parts.find((part) => part.type === 'day')?.value);

    if (!year || !month || !day) {
        return null;
    }

    return { day, month, year };
}

function getCalendarDayNumber(parts: DateParts) {
    return Math.floor(
        Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000,
    );
}

export function getMessageDateKey(createdAt: string) {
    const parts = getDateParts(createdAt);

    if (!parts) {
        return '';
    }

    return [parts.year, String(parts.month).padStart(2, '0'), String(parts.day).padStart(2, '0')].join('-');
}

function formatSeparatorDate(createdAt: string) {
    const date = new Date(createdAt);

    if(Number.isNaN(date.getTime())) {
        return '';
    }

    const messageParts = getDateParts(date);
    const todayParts = getDateParts(new Date());

    if (!messageParts || !todayParts) {
        return '';
    }

    const messageDay = getCalendarDayNumber(messageParts);
    const today = getCalendarDayNumber(todayParts);
    const difference = today - messageDay;

    if (difference === 0) {
        return 'Hoy';
    }

    if (difference === 1) {
        return 'Ayer';
    }

    return new Intl.DateTimeFormat('es-CL', {
        timeZone: CHILE_TIME_ZONE,
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
    }).format(date);
}

export function DateSeparator({ date }: DateSeparatorProps) {
    const label = formatSeparatorDate(date);

    if (!label) {
        return null;
    }

    return (
        <div className="my-2 flex justify-center">
            <span className="rounded-lg border border-[var(--hera-border)] bg-[var(--hera-surface-soft)] px-3 py-1.5 text-[11px] font-medium text-[var(--hera-muted)] shadow-sm">
                {label}
            </span>
        </div>
    );
}