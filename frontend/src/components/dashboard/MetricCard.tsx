import type { LucideIcon } from 'lucide-react';

type MetricCardProps = {
  title: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  tone: 'blue' | 'coral' | 'soft-blue';
};

const toneStyles = {
  blue: 'bg-[var(--hera-blue)] text-white',
  coral: 'bg-[var(--hera-coral-soft)] text-[var(--hera-coral-dark)]',
  'soft-blue': 'bg-[var(--hera-blue-soft)] text-[var(--hera-blue-dark)]',
};

export function MetricCard({ title, value, detail, icon: Icon, tone }: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--hera-border)] bg-white p-6 shadow-[0_12px_35px_rgba(42,72,81,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--hera-muted)]">{title}</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight text-[var(--hera-text)]">
            {value}
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${toneStyles[tone]}`}>
          <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-5 border-t border-[var(--hera-border)] pt-4 text-xs text-[var(--hera-muted)]">
        {detail}
      </p>
    </article>
  );
}
