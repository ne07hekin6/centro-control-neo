import Link from "next/link";
import { Activity, BarChart3, ClipboardList, LayoutDashboard, ListTodo, RadioTower } from "lucide-react";
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
    <aside className="panel-muted hidden min-h-screen border-r border-white/10 p-4 md:flex md:flex-col">
      <div className="mb-8 px-2">
        <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/80">
          Centro de Control
        </p>
        <h1 className="mt-2 text-xl font-semibold text-white">{appConfig.name}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {appConfig.subtitle}
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-sm text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/8 hover:text-white"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden xl:inline">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
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
