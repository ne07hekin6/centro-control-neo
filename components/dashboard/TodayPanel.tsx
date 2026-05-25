import { Ban, Crosshair, HeartPulse } from "lucide-react";
import type { DashboardState } from "@/lib/types";

export function TodayPanel({ state }: { state: DashboardState }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <article className="panel rounded-[24px] p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-cyan-200">
          <Crosshair className="h-4 w-4" />
          Acción principal de hoy
        </div>
        <p className="text-2xl font-semibold text-white">{state.today_main_action}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Físico</p>
            <p className="mt-2 text-2xl font-semibold text-white">{state.energy_physical}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Mental</p>
            <p className="mt-2 text-2xl font-semibold text-white">{state.energy_mental}</p>
          </div>
          <div className="rounded-2xl border border-violet-400/14 bg-violet-400/8 p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-violet-200">
              <HeartPulse className="h-4 w-4" />
              Tensión actual
            </div>
            <p className="mt-2 text-2xl font-semibold text-white">{state.current_pressure}</p>
          </div>
        </div>
      </article>

      <article className="panel rounded-[24px] p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-amber-200">
          <Ban className="h-4 w-4" />
          No tocar sin culpa
        </div>
        <p className="text-lg leading-7 text-slate-200">{state.do_not_touch_today}</p>
      </article>
    </section>
  );
}
