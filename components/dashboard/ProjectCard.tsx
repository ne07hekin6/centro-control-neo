import Link from "next/link";
import { ArrowRight, AlertTriangle, Gauge } from "lucide-react";
import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  formatDateTime,
  getCounterProgress,
  getPriorityTone,
  getProjectCategory,
  getProjectDisplayHints,
  getStatusTone,
} from "@/lib/format";
import type { Counter, Project } from "@/lib/types";

export function ProjectCard({
  project,
  relatedCounter,
}: {
  project: Project;
  relatedCounter?: Counter | null;
}) {
  const category = getProjectCategory(project);
  const progress = relatedCounter ? getCounterProgress(relatedCounter) : null;

  return (
    <article className="panel rounded-[24px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{category.label}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{project.name}</h3>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusBadge label={project.status} tone={getStatusTone(project.status) as StatusTone} />
          <StatusBadge label={`Prioridad ${project.priority}`} tone={getPriorityTone(project.priority) as StatusTone} />
          {project.archived ? <StatusBadge label="Archivado" tone="slate" /> : null}
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-200">{project.current_state}</p>
      {getProjectDisplayHints(project) ? (
        <p className="mt-4 text-sm leading-6 text-slate-400">{getProjectDisplayHints(project)}</p>
      ) : null}
      {project.archived ? (
        <div className="mt-4 rounded-2xl border border-slate-400/14 bg-slate-400/8 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
            Archivado{project.archived_at ? ` · ${formatDateTime(project.archived_at)}` : ""}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {project.archived_reason || "Sin motivo registrado."}
          </p>
        </div>
      ) : null}

      {relatedCounter ? (
        <div className="mt-5 rounded-2xl border border-white/8 bg-white/4 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-200">
            <Gauge className="h-4 w-4 text-cyan-300" />
            <span>{relatedCounter.label}</span>
            {relatedCounter.type === "date_based" ? (
              <StatusBadge label="Auto" tone="cyan" />
            ) : null}
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-semibold text-white">{relatedCounter.current_value}</p>
            {relatedCounter.target_value ? (
              <p className="pb-1 text-sm text-slate-400">/ {relatedCounter.target_value}</p>
            ) : null}
          </div>
          {progress !== null ? (
            <div className="mt-3">
              <ProgressBar value={progress} tone={(relatedCounter.accent || "cyan") as "amber" | "cyan" | "green" | "violet" | "slate"} />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Próxima acción</p>
          <p className="mt-2 text-sm leading-6 text-white">{project.next_action}</p>
        </div>
        {project.blocker ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/8 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-rose-200">
              <AlertTriangle className="h-4 w-4" />
              Bloqueo
            </div>
            <p className="text-sm leading-6 text-rose-100">{project.blocker}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
        <p className="text-xs text-slate-500">
          Última actualización: {formatDateTime(project.last_updated)}
        </p>
        <Link
          href={`/projects/${project.project_id}`}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-400/18 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/10"
        >
          Ver detalle
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
