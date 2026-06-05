import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { CounterStrip } from "@/components/dashboard/CounterStrip";
import { TodayPanel } from "@/components/dashboard/TodayPanel";
import { DataFreshnessAlert } from "@/components/dashboard/DataFreshnessAlert";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { CheckinSummary } from "@/components/dashboard/CheckinSummary";
import { TimelinePanel } from "@/components/dashboard/TimelinePanel";
import {
  getControlCenterData,
  getLatestCheckin,
  getLatestClosure,
  getRelatedCounter,
} from "@/lib/controlCenterData";
import { getDashboardFreshness } from "@/lib/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await getControlCenterData();
  const latestCheckin = getLatestCheckin(data.dailyCheckins);
  const latestClosure = getLatestClosure(data.dailyCheckins);
  const freshness = getDashboardFreshness(data.dashboardState.date);
  const activeProjects = data.projects.filter((project) => !project.archived);

  return (
    <AppShell timeline={data.updatesLog.slice(0, 8)}>
      <div className="space-y-4">
        {data.warning ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            {data.warning}
          </div>
        ) : null}

        <Header
          state={data.dashboardState}
          counters={data.counters}
          freshness={freshness}
        />
        <DataFreshnessAlert freshness={freshness} />
        <CounterStrip counters={data.counters} />
        <TodayPanel state={data.dashboardState} />

        <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-2">
              {activeProjects.map((project) => (
                <ProjectCard
                  key={project.project_id}
                  project={project}
                  relatedCounter={getRelatedCounter(data.counters, project)}
                />
              ))}
            </div>
            <CheckinSummary
              latestCheckin={latestCheckin}
              latestClosure={latestClosure}
            />
          </div>

          <div className="2xl:hidden">
            <TimelinePanel entries={data.updatesLog.slice(0, 6)} />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
