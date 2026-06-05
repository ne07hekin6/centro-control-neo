import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatUpdateTypeTag } from "@/lib/format";
import { getControlCenterData } from "@/lib/controlCenterData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CheckinsPage() {
  const data = await getControlCenterData();

  return (
    <AppShell timeline={data.updatesLog.slice(0, 8)}>
      <div className="space-y-4">
        <section className="panel rounded-[28px] p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Check-ins</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Últimos check-ins y cierres</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Resumen corto de energía, acción principal y próximo paso.
          </p>
        </section>

        <section className="grid gap-4">
          {data.dailyCheckins.map((entry) => (
            <article key={`${entry.date}-${entry.type}`} className="panel rounded-[24px] p-5">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusBadge label={formatUpdateTypeTag(entry.type)} tone="slate" />
                    <p className="text-sm text-slate-500">{formatDate(entry.date)}</p>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">{entry.summary}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Energía física</p>
                    <p className="mt-2 text-xl font-semibold text-white">{entry.physical_energy}</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Energía mental</p>
                    <p className="mt-2 text-xl font-semibold text-white">{entry.mental_energy}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 xl:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Acción principal</p>
                  <p className="mt-2 text-sm text-white">{entry.main_action}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Acción de mañana</p>
                  <p className="mt-2 text-sm text-white">{entry.tomorrow_action}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
