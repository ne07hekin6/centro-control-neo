import { AppShell } from "@/components/layout/AppShell";
import { LogFilters } from "@/components/log/LogFilters";
import { getControlCenterData } from "@/lib/controlCenterData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LogPage() {
  const data = await getControlCenterData();
  const allProjects = [...data.projects, ...data.archivedProjects];

  return (
    <AppShell timeline={data.updatesLog.slice(0, 8)}>
      <div className="space-y-4">
        <section className="panel rounded-[28px] p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Feed completo</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Bitácora y señales</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Orden descendente, filtros livianos y detalles expandibles. El historial no domina la home.
          </p>
        </section>

        <LogFilters projects={allProjects} entries={data.updatesLog} />
      </div>
    </AppShell>
  );
}
