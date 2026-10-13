"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PlusCircle, Wrench } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Equipos", icon: LayoutGrid, exact: true },
  { href: "/equipos/nuevo", label: "Nuevo equipo", icon: PlusCircle, exact: true },
  { href: "/mantenimientos/nuevo", label: "Nuevo mantenimiento", icon: Wrench, exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col bg-slate-900 text-slate-300">
      <div className="flex items-center gap-2 px-4 py-5">
        <span className="text-xl">🛠️</span>
        <div>
          <p className="text-sm font-semibold text-white">Mantenimiento</p>
          <p className="text-xs text-slate-500">DJI Dock &amp; Drones</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Seguimiento
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                active
                  ? "bg-violet-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 border-t border-slate-800 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
          LA
        </div>
        <div>
          <p className="text-sm font-medium text-white">Luca Alconcher</p>
          <p className="text-xs text-slate-500">Técnico</p>
        </div>
      </div>
    </aside>
  );
}
