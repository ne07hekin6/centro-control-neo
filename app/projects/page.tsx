import { AppShell } from "@/components/layout/AppShell";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { getControlCenterData, getRelatedCounter } from "@/lib/controlCenterData";

export default async function ProjectsPage() {
  const data = await getControlCenterData();

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
          {data.projects.map((project) => (
            <ProjectCard
              key={project.project_id}
              project={project}
              relatedCounter={getRelatedCounter(data.counters, project)}
            />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
