import type { TipoEquipo, TipoMantenimiento } from "@/lib/db";

export const TIPO_EQUIPO_LABEL: Record<TipoEquipo, string> = {
  dock: "DJI Dock",
  drone: "Drone",
  otro: "Otro",
};

export const TIPO_EQUIPO_COLOR: Record<TipoEquipo, string> = {
  dock: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
  drone: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
  otro: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
};

export const TIPO_MANTENIMIENTO_LABEL: Record<TipoMantenimiento, string> = {
  preventivo: "Preventivo",
  correctivo: "Correctivo",
  revision: "Revisión",
};

export const TIPO_MANTENIMIENTO_COLOR: Record<TipoMantenimiento, string> = {
  preventivo: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  correctivo: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
  revision: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
};

export function formatFecha(fecha: string) {
  const [y, m, d] = fecha.split("-");
  if (!y || !m || !d) return fecha;
  return `${d}/${m}/${y}`;
}
