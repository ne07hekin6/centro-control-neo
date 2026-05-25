import {
  formatDateTime,
  formatProjectTag,
  formatUpdateTypeTag,
  getStatusTone,
} from "@/lib/format";
import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";
import type { UpdateLogEntry } from "@/lib/types";

export function TimelinePanel({
  entries,
  compact = false,
}: {
  entries: UpdateLogEntry[];
  compact?: boolean;
}) {
  return (
    <section className={compact ? "" : "panel rounded-[24px] p-5"}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Actividad</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Reciente</h3>
        </div>
      </div>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
            Sin movimientos recientes.
          </div>
        ) : (
          entries.map((entry) => (
            <details
              key={`${entry.timestamp}-${entry.project_id}-${entry.summary}`}
              className="rounded-2xl border border-white/8 bg-white/3 p-4"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        label={formatProjectTag(entry.project_id)}
                        tone={getStatusTone(entry.project_id) as StatusTone}
                      />
                      <StatusBadge label={formatUpdateTypeTag(entry.type)} tone="slate" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white">{entry.summary}</p>
                  </div>
                  <p className="text-xs text-slate-500">{formatDateTime(entry.timestamp)}</p>
                </div>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-300">{entry.details}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Clima: {entry.mood || "s/d"}</span>
                <span>Energía: {entry.energy || "s/d"}</span>
                <span>Fuente: {entry.source || "s/d"}</span>
              </div>
            </details>
          ))
        )}
      </div>
    </section>
  );
}
