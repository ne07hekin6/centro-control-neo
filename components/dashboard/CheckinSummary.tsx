import { formatDate } from "@/lib/format";
import type { DailyCheckin } from "@/lib/types";

function CheckinCard({
  title,
  entry,
}: {
  title: string;
  entry: DailyCheckin | null;
}) {
  return (
    <article className="panel rounded-[24px] p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{title}</p>
      {entry ? (
        <>
          <h3 className="mt-2 text-lg font-semibold text-white">{formatDate(entry.date)}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-200">{entry.summary}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Acción</p>
              <p className="mt-2 text-sm text-white">{entry.main_action}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/3 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Mañana</p>
              <p className="mt-2 text-sm text-white">{entry.tomorrow_action}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">{entry.notes}</p>
        </>
      ) : (
        <p className="mt-3 text-sm text-slate-400">No hay datos para esta vista.</p>
      )}
    </article>
  );
}

export function CheckinSummary({
  latestCheckin,
  latestClosure,
}: {
  latestCheckin: DailyCheckin | null;
  latestClosure: DailyCheckin | null;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <CheckinCard title="Último check-in" entry={latestCheckin} />
      <CheckinCard title="Último cierre" entry={latestClosure} />
    </section>
  );
}
