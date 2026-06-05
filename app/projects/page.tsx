import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { getControlCenterData, getRelatedCounter } from "@/lib/controlCenterData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>;
}) {
  const params = await searchParams;
  const showArchived = params.archived === "1";
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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Proyectos</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                {showArchived ? "Proyectos archivados" : "Frentes activos"}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                {showArchived
                  ? "Vista de archivo para consultar contexto histórico sin mezclarlo con lo activo."
                  : "Vista amplia por frente. Acá entra más contexto, pero sin perder la prioridad del presente."}
              </p>
            </div>
            {archivedProjects.length > 0 ? (
              <Link
                href={showArchived ? "/projects" : "/projects?archived=1"}
                className="inline-flex w-fit items-center rounded-full border border-slate-400/16 bg-slate-400/8 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-400/12"
              >
                {showArchived
                  ? "Volver a activos"
                  : `Ver archivados (${archivedProjects.length})`}
              </Link>
            ) : null}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-2">
          {(showArchived ? archivedProjects : activeProjects).map((project) => (
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
