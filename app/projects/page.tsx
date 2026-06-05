import { AppShell } from "@/components/layout/AppShell";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { getControlCenterData, getRelatedCounter } from "@/lib/controlCenterData";

export default async function ProjectsPage() {
  const data = await getControlCenterData();
  const activeProjects = data.projects.filter((project) => !project.archived);
  const archivedProjects = [
    ...data.archivedProjects,
    ...data.projects.filter((project) => project.archived),
  ];

  return (
    <AppShell timeline={data.updatesLog.slice(0, 8)}>
      <div className="space-y-4">
        <section className="panel rounded-[28px] p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Proyectos</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Frentes activos</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Vista amplia por frente. Acá entra más contexto, pero sin perder la prioridad del presente.
          </p>
        </section>

        <section className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-2">
          {activeProjects.map((project) => (
            <ProjectCard
              key={project.project_id}
              project={project}
              relatedCounter={getRelatedCounter(data.counters, project)}
            />
          ))}
        </section>

        {archivedProjects.length > 0 ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Archivados
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Proyectos archivados
                </h2>
              </div>
              <span className="rounded-full border border-slate-400/16 bg-slate-400/8 px-3 py-1 text-xs text-slate-300">
                {archivedProjects.length}
              </span>
            </div>
            <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-2">
              {archivedProjects.map((project) => (
                <ProjectCard
                  key={project.project_id}
                  project={project}
                  relatedCounter={getRelatedCounter(data.counters, project)}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
