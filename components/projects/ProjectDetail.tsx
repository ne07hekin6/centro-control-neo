import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  formatDateTime,
  formatUpdateTypeTag,
  getCounterProgress,
  getPriorityTone,
  getProjectCategory,
  getStatusTone,
} from "@/lib/format";
import type { Counter, DailyCheckin, Project, UpdateLogEntry } from "@/lib/types";

export function ProjectDetail({
  project,
  updates,
  checkins,
  counter,
}: {
  project: Project;
  updates: UpdateLogEntry[];
  checkins: DailyCheckin[];
  counter: Counter | null;
}) {
  const category = getProjectCategory(project);
  const progress = counter ? getCounterProgress(counter) : null;

  return (
    <div className="space-y-4">
      <section className="panel rounded-[28px] p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{category.label}</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{project.name}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-200">{project.current_state}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={project.status} tone={getStatusTone(project.status) as StatusTone} />
            <StatusBadge label={`Prioridad ${project.priority}`} tone={getPriorityTone(project.priority) as StatusTone} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[22px] border border-white/8 bg-white/3 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Próxima acción</p>
            <p className="mt-3 text-lg text-white">{project.next_action}</p>
            {project.blocker ? (
              <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/8 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-rose-200">Bloqueo</p>
                <p className="mt-2 text-sm leading-6 text-rose-100">{project.blocker}</p>
              </div>
            ) : null}
            <p className="mt-5 text-xs text-slate-500">
              Última actualización: {formatDateTime(project.last_updated)}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/8 bg-white/3 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Notas</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">{project.notes || "Sin notas."}</p>
            {counter ? (
              <div className="mt-5">
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-semibold text-white">{counter.current_value}</p>
                  {counter.target_value ? <p className="pb-1 text-sm text-slate-400">/ {counter.target_value}</p> : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
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
                  <div className="mt-3">
                    <ProgressBar value={progress} tone={(counter.accent || "cyan") as "amber" | "cyan" | "green" | "violet" | "slate"} />
                  </div>
                ) : null}
                <p className="mt-3 text-sm text-slate-300">{counter.notes}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel rounded-[24px] p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Actualizaciones del proyecto</p>
          <div className="mt-4 space-y-3">
            {updates.length === 0 ? (
              <p className="text-sm text-slate-400">Sin actualizaciones relacionadas.</p>
            ) : (
              updates.map((entry) => (
                <div key={`${entry.timestamp}-${entry.summary}`} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{entry.summary}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{entry.details}</p>
                    </div>
                    <StatusBadge label={formatUpdateTypeTag(entry.type)} tone="slate" />
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{formatDateTime(entry.timestamp)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel rounded-[24px] p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Check-ins relacionados</p>
          <div className="mt-4 space-y-3">
            {checkins.length === 0 ? (
              <p className="text-sm text-slate-400">No aparecen check-ins relacionados con este frente.</p>
            ) : (
              checkins.map((entry) => (
                <div key={`${entry.date}-${entry.type}`} className="rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{entry.summary}</p>
                    <StatusBadge label={formatUpdateTypeTag(entry.type)} tone="slate" />
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{entry.main_action}</p>
                  <p className="mt-2 text-xs text-slate-500">{entry.date}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
