import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import {
  getControlCenterData,
  getProjectCheckins,
  getProjectUpdates,
  getRelatedCounter,
} from "@/lib/controlCenterData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const data = await getControlCenterData();
  const allProjects = [...data.projects, ...data.archivedProjects];
  const project = allProjects.find((entry) => entry.project_id === projectId);

  if (!project) {
    notFound();
  }

  return (
    <AppShell timeline={getProjectUpdates(data.updatesLog, project.project_id).slice(0, 8)}>
      <ProjectDetail
        project={project}
        updates={getProjectUpdates(data.updatesLog, project.project_id)}
        checkins={getProjectCheckins(data.dailyCheckins, project.project_id, project.name)}
        counter={getRelatedCounter(data.counters, project)}
      />
    </AppShell>
  );
}
