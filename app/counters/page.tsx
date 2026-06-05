import { AppShell } from "@/components/layout/AppShell";
import { CounterStrip } from "@/components/dashboard/CounterStrip";
import { formatDateTime } from "@/lib/format";
import { getControlCenterData } from "@/lib/controlCenterData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CountersPage() {
  const data = await getControlCenterData();
  const historicalHints = data.updatesLog.filter((entry) =>
    ["counter_update", "health", "milestone"].includes(entry.type),
  );

  return (
    <AppShell timeline={data.updatesLog.slice(0, 8)}>
      <div className="space-y-4">
        <section className="panel rounded-[28px] p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Indicadores</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Progreso visible</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Indicadores manuales y automáticos para seguir avance real.
          </p>
        </section>

        <CounterStrip counters={data.counters} />

        <section className="panel rounded-[24px] p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Histórico inferido</p>
          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {historicalHints.map((entry) => (
              <div key={`${entry.timestamp}-${entry.summary}`} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                <p className="text-sm font-medium text-white">{entry.summary}</p>
                <p className="mt-2 text-sm text-slate-300">{entry.details}</p>
                <p className="mt-3 text-xs text-slate-500">{formatDateTime(entry.timestamp)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
