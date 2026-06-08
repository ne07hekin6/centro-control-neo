import Link from "next/link";
import {
  Activity,
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  ListTodo,
  Menu,
  RadioTower,
} from "lucide-react";
import { logoutAction } from "@/app/unlock/actions";
import { isAccessProtectionEnabled } from "@/lib/auth";
import { appConfig } from "@/lib/appConfig";

const navItems = [
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/projects", label: "Proyectos", icon: ClipboardList },
  { href: "/counters", label: "Indicadores", icon: BarChart3 },
  { href: "/checkins", label: "Check-ins", icon: Activity },
  { href: "/log", label: "Bitácora", icon: RadioTower },
];

export function Sidebar() {
  return (
    <aside className="panel-muted hidden min-h-screen border-r border-white/10 p-3 md:flex md:flex-col md:items-center xl:items-stretch xl:p-4">
      <div className="mb-8 hidden px-2 xl:block">
        <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/80">
          Centro de Control
        </p>
        <h1 className="mt-2 text-xl font-semibold text-white">{appConfig.name}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {appConfig.subtitle}
        </p>
      </div>
      <div
        aria-label={appConfig.name}
        className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/8 text-sm font-semibold text-cyan-100 xl:hidden"
      >
        CC
      </div>

      <nav className="flex w-full flex-col items-center gap-2 xl:items-stretch">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            title={label}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-transparent text-sm text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/8 hover:text-white xl:h-auto xl:w-full xl:justify-start xl:gap-3 xl:px-3 xl:py-3"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden xl:inline">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto hidden rounded-2xl border border-slate-800 bg-slate-950/60 p-4 xl:block">
        <div className="mb-2 flex items-center gap-2 text-slate-300">
          <ListTodo className="h-4 w-4 text-cyan-300" />
          <span className="text-sm font-medium">Regla de lectura</span>
        </div>
        <p className="text-sm leading-6 text-slate-400">
          Este tablero ayuda a decidir. El historial no manda sobre el presente.
        </p>
        {isAccessProtectionEnabled() ? (
          <form action={logoutAction} className="mt-4">
            <button
              type="submit"
              className="w-full rounded-2xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-white"
            >
              Cerrar acceso
            </button>
          </form>
        ) : null}
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/92 px-4 py-3 backdrop-blur md:hidden">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/4 px-3 py-3 text-white transition hover:border-cyan-400/20 hover:bg-cyan-400/8 [&::-webkit-details-marker]:hidden">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300/80">
              Centro de Control
            </p>
            <p className="mt-1 text-sm font-semibold">{appConfig.name}</p>
          </div>
          <Menu className="h-5 w-5 text-cyan-200" />
        </summary>

        <nav className="mt-3 grid gap-2 rounded-2xl border border-white/10 bg-slate-950/96 p-2 shadow-2xl shadow-slate-950/40">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-200 transition hover:bg-cyan-400/10 hover:text-white"
            >
              <Icon className="h-4 w-4 shrink-0 text-cyan-200" />
              {label}
            </Link>
          ))}
          {isAccessProtectionEnabled() ? (
            <form action={logoutAction} className="border-t border-white/10 pt-2">
              <button
                type="submit"
                className="w-full rounded-xl px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-cyan-400/10 hover:text-white"
              >
                Cerrar acceso
              </button>
            </form>
          ) : null}
        </nav>
      </details>
    </header>
  );
}
