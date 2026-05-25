import { ProgressBar } from "@/components/ui/ProgressBar";
import { getCounterProgress, formatDateTime, formatPercent } from "@/lib/format";
import type { Counter } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

function getCounterTone(counter: Counter) {
  const tones = ["amber", "cyan", "green", "violet", "slate"] as const;
  const accent = counter.accent as (typeof tones)[number];
  return tones.includes(accent) ? accent : "cyan";
}

export function CounterStrip({ counters }: { counters: Counter[] }) {
  return (
    <section className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
      {counters.map((counter) => {
        const progress = getCounterProgress(counter);
        const tone = getCounterTone(counter);

        return (
          <article key={counter.counter_id} className="panel rounded-[24px] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">{counter.label}</p>
                <div className="mt-3 flex items-end gap-2">
                  <p className="text-4xl font-semibold text-white">{counter.current_value}</p>
                  {counter.target_value ? (
                    <p className="pb-1 text-sm text-slate-400">/ {counter.target_value}</p>
                  ) : null}
                </div>
              </div>
              {progress !== null ? (
                <div className="rounded-xl border border-white/8 px-3 py-2 text-right">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Progreso</p>
                  <p className="text-sm font-semibold text-white">{formatPercent(progress)}</p>
                </div>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge
                label={counter.type === "date_based" ? "Automático" : "Manual"}
                tone={counter.type === "date_based" ? "cyan" : "slate"}
              />
              {counter.type === "date_based" && counter.reset_date ? (
                <StatusBadge label={`Reset ${counter.reset_date}`} tone="violet" />
              ) : null}
              {counter.type === "date_based" && !counter.reset_date && counter.start_date ? (
                <StatusBadge label={`Inicio ${counter.start_date}`} tone="green" />
              ) : null}
            </div>
            {progress !== null ? (
              <div className="mt-4">
                <ProgressBar value={progress} tone={tone} />
              </div>
            ) : null}
            <p className="mt-4 text-sm leading-6 text-slate-300">{counter.notes}</p>
            <p className="mt-4 text-xs text-slate-500">
              Última señal: {formatDateTime(counter.last_updated)}
            </p>
          </article>
        );
      })}
    </section>
  );
}
