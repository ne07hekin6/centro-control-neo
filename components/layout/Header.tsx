import { Activity, Gauge, Sparkles } from "lucide-react";
import { formatDate, type DashboardFreshness } from "@/lib/format";
import type { Counter, DashboardState } from "@/lib/types";

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
      <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-base font-semibold text-white">{value}</div>
    </div>
  );
}

export function Header({
  state,
  counters,
  freshness,
}: {
  state: DashboardState;
  counters: Counter[];
  freshness: DashboardFreshness;
}) {
  const highlights = counters.slice(0, 2);
  const freshnessBadge =
    freshness.status === "current"
      ? { text: "Actualizado hoy", tone: "border-green-400/20 bg-green-400/10 text-green-200" }
      : freshness.status === "stale"
        ? {
            text: `Desactualizado hace ${freshness.differenceDays} ${
              freshness.differenceDays === 1 ? "día" : "días"
            }`,
            tone: "border-amber-400/20 bg-amber-400/10 text-amber-200",
          }
        : freshness.status === "future"
          ? { text: "Fecha inconsistente", tone: "border-red-400/20 bg-red-400/10 text-red-200" }
          : { text: "Fecha desconocida", tone: "border-red-400/20 bg-red-400/10 text-red-200" };

  return (
    <header className="panel rounded-[28px] p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/80">
            Estado de hoy
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-semibold text-white">{state.main_focus}</h2>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${freshnessBadge.tone}`}
            >
              {freshnessBadge.text}
            </span>
          </div>
          {state.date ? (
            <p className="mt-3 text-sm text-slate-400">{formatDate(state.date)}</p>
          ) : null}
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            {state.notes}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          <StatPill icon={Activity} label="Energía física" value={state.energy_physical} />
          <StatPill icon={Sparkles} label="Energía mental" value={state.energy_mental} />
          {highlights.map((counter) => (
            <StatPill
              key={counter.counter_id}
              icon={Gauge}
              label={counter.label}
              value={
                counter.target_value
                  ? `${counter.current_value}/${counter.target_value}`
                  : `${counter.current_value}`
              }
            />
          ))}
        </div>
      </div>
    </header>
  );
}
