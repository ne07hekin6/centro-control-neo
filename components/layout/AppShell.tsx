import { ReactNode } from "react";
import { MobileNav, Sidebar } from "@/components/layout/Sidebar";
import { TimelinePanel } from "@/components/dashboard/TimelinePanel";
import type { UpdateLogEntry } from "@/lib/types";

export function AppShell({
  children,
  timeline,
}: {
  children: ReactNode;
  timeline?: UpdateLogEntry[];
}) {
  return (
    <div className="grid-dashboard bg-background text-foreground">
      <MobileNav />
      <Sidebar />
      <main className="min-w-0 p-4 md:p-5 xl:p-6">{children}</main>
      <aside className="panel-muted hidden min-h-screen border-l border-white/10 p-4 2xl:block">
        <TimelinePanel entries={timeline ?? []} compact />
      </aside>
    </div>
  );
}
