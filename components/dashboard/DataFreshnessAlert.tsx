import { AlertTriangle, CalendarClock } from "lucide-react";
import {
  formatDateValue,
  type DashboardFreshness,
} from "@/lib/format";

export function DataFreshnessAlert({
  freshness,
}: {
  freshness: DashboardFreshness;
}) {
  if (freshness.status === "current" || freshness.status === "grace") {
    return null;
  }

  const isStale = freshness.status === "stale";
  const title = isStale
    ? "Tu Centro de Control está desactualizado."
    : freshness.status === "future"
      ? "La fecha del estado necesita revisión."
      : "No se conoce la fecha del estado actual.";
  const borderTone = isStale
    ? "border-amber-400/30 bg-amber-400/10"
    : "border-red-400/25 bg-red-400/10";
  const iconTone = isStale ? "text-amber-200" : "text-red-200";
  const registeredDate = freshness.registeredDate
    ? formatDateValue(freshness.registeredDate)
    : "Sin registrar";

  return (
    <section
      aria-live="polite"
      className={`rounded-[22px] border px-5 py-4 ${borderTone}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex max-w-3xl gap-3">
          <AlertTriangle className={`mt-0.5 h-5 w-5 shrink-0 ${iconTone}`} />
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-200">
              {isStale ? (
                <>
                  El último estado registrado es del {registeredDate}. Para
                  mantener el panel vivo, actualizá los últimos cambios con el
                  Main Control.
                </>
              ) : freshness.status === "future" ? (
                <>
                  El último estado registrado figura como {registeredDate}, una
                  fecha posterior a hoy. Revisá la información con el Main
                  Control.
                </>
              ) : (
                <>
                  Falta la fecha del último estado registrado. Volvé al Main
                  Control para revisar y actualizar el panel.
                </>
              )}
            </p>
            <p className="mt-3 text-sm font-medium text-white">
              Volvé al chat Main Control y pasale un update rápido del día.
            </p>
          </div>
        </div>

        <dl className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[340px]">
          <FreshnessStat
            label="Hoy"
            value={formatDateValue(freshness.currentDate)}
          />
          <FreshnessStat label="Último estado" value={registeredDate} />
          {freshness.differenceDays !== null && freshness.differenceDays > 0 ? (
            <FreshnessStat
              label={isStale ? "Demora" : "Diferencia"}
              value={`${freshness.differenceDays} ${
                freshness.differenceDays === 1 ? "día" : "días"
              }`}
            />
          ) : null}
        </dl>
      </div>
    </section>
  );
}

function FreshnessStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/25 px-3 py-2">
      <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-slate-400">
        <CalendarClock className="h-3 w-3" />
        {label}
      </dt>
      <dd className="mt-1 text-xs font-medium leading-5 text-white">{value}</dd>
    </div>
  );
}
