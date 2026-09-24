import { dashboardMetrics } from './dashboard.mock.ts';
import { MetricCard } from './MetricCard.tsx';

export function Dashboard() {
  return (
    <main className="h-full overflow-y-auto px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-[var(--hera-blue)]">Resumen de atención</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--hera-text)] sm:text-3xl">
            Buenos días, Administrador
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--hera-muted)]">
            Una vista simple del estado actual de las conversaciones de Clínica Hera.
          </p>
        </div>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Métricas principales">
          {dashboardMetrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </section>
      </div>
    </main>
  );
}
