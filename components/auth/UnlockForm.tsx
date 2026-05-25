"use client";

import { useActionState } from "react";
import { Shield } from "lucide-react";
import { unlockAction, type UnlockState } from "@/app/unlock/actions";
import { appConfig } from "@/lib/appConfig";

const initialState: UnlockState = {};

export function UnlockForm({
  nextPath,
  setupRequired,
}: {
  nextPath: string;
  setupRequired: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    unlockAction,
    initialState,
  );

  return (
    <form action={formAction} className="panel w-full max-w-md rounded-[28px] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3">
          <Shield className="h-5 w-5 text-cyan-200" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Acceso privado
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            {appConfig.name}
          </h1>
        </div>
      </div>

      {setupRequired ? (
        <p className="text-sm leading-6 text-amber-200">
          Configuración incompleta. Definí una contraseña de acceso en las
          variables del deployment para habilitar este dashboard.
        </p>
      ) : (
        <p className="mb-5 text-sm leading-6 text-slate-300">
          Ingresá la clave para continuar.
        </p>
      )}

      {!setupRequired ? (
        <>
          <input type="hidden" name="next" value={nextPath} />

          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.14em] text-slate-500">
              Contraseña
            </span>
            <input
              name="password"
              type="password"
              autoFocus
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="Ingresá la clave"
            />
          </label>

          {state.error ? (
            <p className="mt-3 text-sm text-rose-300">{state.error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/12 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/18 disabled:opacity-60"
          >
            {isPending ? "Verificando..." : "Entrar"}
          </button>
        </>
      ) : null}
    </form>
  );
}
