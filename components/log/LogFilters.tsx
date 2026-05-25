"use client";

import { useMemo, useState } from "react";
import { TimelinePanel } from "@/components/dashboard/TimelinePanel";
import { formatUpdateTypeTag } from "@/lib/format";
import type { Project, UpdateLogEntry } from "@/lib/types";

export function LogFilters({
  projects,
  entries,
}: {
  projects: Project[];
  entries: UpdateLogEntry[];
}) {
  const [projectFilter, setProjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [query, setQuery] = useState("");

  const types = useMemo(
    () => Array.from(new Set(entries.map((entry) => entry.type).filter(Boolean))),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesProject =
        projectFilter === "all" || entry.project_id === projectFilter;
      const matchesType = typeFilter === "all" || entry.type === typeFilter;
      const haystack =
        `${entry.summary} ${entry.details} ${entry.project_id} ${entry.type}`.toLowerCase();
      const matchesQuery =
        !normalizedQuery || haystack.includes(normalizedQuery);

      return matchesProject && matchesType && matchesQuery;
    });
  }, [entries, projectFilter, query, typeFilter]);

  return (
    <div className="space-y-4">
      <section className="panel rounded-[24px] p-5">
        <div className="grid gap-4 xl:grid-cols-[220px_220px_minmax(0,1fr)]">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Proyecto</span>
            <select
              value={projectFilter}
              onChange={(event) => setProjectFilter(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">Todos</option>
              {projects.map((project) => (
                <option key={project.project_id} value={project.project_id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Tipo</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">Todos</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {formatUpdateTypeTag(type)}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Buscar</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Resumen, detalle, proyecto"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>
      </section>

      <TimelinePanel entries={filteredEntries} />
    </div>
  );
}
